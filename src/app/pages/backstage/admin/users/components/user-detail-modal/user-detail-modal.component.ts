import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NZ_MODAL_DATA, NzModalRef, NzModalService} from 'ng-zorro-antd/modal';
import {UserDTO} from "../../../data/admin.dto";
import {AdminService} from "../../../data/admin.service";
import {ValidatorUtil} from "@core/utils/validator.util";
import {FormUtil} from "@core/utils/form.util";
import {SaveBusinessProfileRequest, SwitchStatusBusinessRequest} from "../../../models";
import {NotificationService} from "@core/services/notification.service";
import {SettingsService} from "../../../../settings/data/settings.service";
import {NzMessageService} from "ng-zorro-antd/message";

@Component({
  selector: 'app-user-detail-modal',
  templateUrl: './user-detail-modal.component.html',
})
export class UserDetailModalComponent implements OnInit {

  isProcessing = false;

  readonly modalData: {user: UserDTO} = inject(NZ_MODAL_DATA);
  form: FormGroup;

  statusBusinessEmail = false;
  markClose = false; // cái này là dùng để đánh dấu, nếu trong modal đã đổi status thì sau khi close modal phải gọi lại list user ở ngoài

  smtpForm!: FormGroup;
  useCustomSmtp: boolean = false;
  lastTestResult: string | null = null;
  lastTestedAt: string | null = null;

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private adminService: AdminService,
    private settingsService: SettingsService,
    private modalRef: NzModalRef,
    private notification: NotificationService,
    private modal: NzModalService,
  ) {

  }

  get user(): UserDTO {
    return this.modalData.user;
  }
  set user(user: UserDTO) {
    this.modalData.user = user;
  }

  ngOnInit(): void {
    this.buildBusinessForm();
    this.initSmtpForm();
    this.loadSmtpSetting();

    this.form.patchValue({
      businessName: this.user.businessName,
      businessEmail: this.user.businessEmail,
      businessDomain: this.user.domain,
    });
    this.statusBusinessEmail = this.user.statusBusinessEmail == 'ACTIVE'
    if (this.user.useCustomSmtp) {
      this.useCustomSmtp = this.user.useCustomSmtp;
    }
  }

  initSmtpForm() {
    this.smtpForm = this.fb.group({
      provider: ['office365', Validators.required],
      smtpServer: ['smtp.office365.com', Validators.required],
      smtpPort: [587, Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.smtpForm.get('provider')?.valueChanges.subscribe((provider) => {
      if (provider.toLowerCase() === 'office365') {
        // Office365 chỉ cho phép port 587 và host cố định
        this.smtpForm.patchValue({
          smtpPort: 587,
          smtpServer: 'smtp.office365.com'
        });
      } else if (provider.toLowerCase() === 'ses') {
        // SES có thể chọn port 587 hoặc 465, nhưng không tự set host
        this.smtpForm.patchValue({
          smtpPort: 587,
          smtpServer: ''
        });
      }

      // Reset port nếu không hợp lệ (tránh lưu port 465 cho office365)
      const port = this.smtpForm.get('smtpPort')?.value;
      if (provider.toLowerCase() === 'office365' && port !== 587) {
        this.smtpForm.patchValue({ smtpPort: 587 });
      }
    });

  }

  saveBusinessInfo(){
    FormUtil.validate(this.form);
    const request: SaveBusinessProfileRequest = {
      userId: this.user.id!,
      ...this.form.getRawValue()
    }
    this.adminService.updateBusinessProfile(request).pipe()
      .subscribe({
        next: (res: any) => {
          this.notification.open({
            type: 'success',
            content: res?.message || 'Đã cập nhật thông tin business!'
          });
          this.modalRef.destroy(true)
        },
        error: ({error}) => {
          this.notification.open({
            type: 'error',
            content: error?.message || 'Cập nhật business thất bại!'
          });
        }
      })
  }

  buildBusinessForm(){
    this.form = this.fb.group({
      businessName: [null, [ValidatorUtil.required('Tên doanh nghiệp không được để trống!')]],
      businessEmail: [null, [ValidatorUtil.required('Email doanh nghiệp không được để trống!'), ValidatorUtil.email('Email không đúng định dạng!')]],
      businessDomain: [null],
    });

  }

  closeModal(): void {
    if (this.markClose){
      this.modalRef.destroy(true);
    } else {
      this.modalRef.destroy();
    }
  }

  onSwitchStatus(item: UserDTO){
    const request: SwitchStatusBusinessRequest = {
      userId: item.id!,
      status: !this.statusBusinessEmail,
    }
    this.adminService.updateBusinessStatus(request)
      .pipe()
      .subscribe({
        next: (res: any) => {
          this.notification.open({
            type: 'success',
            content: res?.message || 'Trạng thái business đã được cập nhật'
          });
          this.statusBusinessEmail = !this.statusBusinessEmail;
          this.markClose = true;
        },
        error: ({error}) => {
          this.notification.open({
            type: 'error',
            content: error?.message || 'Có lỗi khi thay đổi trạng thái business'
          });
        }
      })
  }

  confirmSwitchStatus(item: UserDTO){
    this.modal.confirm({
      nzTitle: `Bạn có muốn thay đổi trạng thái business của email "${item.email}"?`,
      nzOkText: 'OK',
      nzOnOk: () => this.onSwitchStatus(item)
    });
  }

  isSmtpFormVisible(): boolean {
    return this.useCustomSmtp;
  }

  onToggleCustomSmtp(enabled: boolean): void {

    if (!this.user || !this.user.id) return;
    this.adminService.updateCustomSmtpStatus(this.user.id, !enabled).subscribe({
      next: res => {
        this.message.success(res.message || 'Cập nhật trạng thái SMTP thành công!');
        this.useCustomSmtp = !enabled;
      },
      error: err => {
        this.message.error('Lỗi khi cập nhật trạng thái SMTP!');
      }
    });

    if (!enabled) {
      this.smtpForm.reset();
      this.smtpForm.disable();
    } else {
      setTimeout(() => this.smtpForm.enable());
    }
  }

  loadSmtpSetting(): void {
    if (!this.user || !this.user.id) return;
    this.adminService.getUserSMTP(this.user.id).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.smtpForm.patchValue({
            ...res.data,
            provider: res.data.provider?.toLowerCase() || null
          });

          // Gán test result ra biến hiển thị
          if (res.data.lastTestResult) {
            this.lastTestResult = res.data.lastTestResult;
          }
          if (res.data.lastTestedAt) {
            this.lastTestedAt = res.data.lastTestedAt;
          }

        } else {
          console.warn('Không tìm thấy cấu hình SMTP');
        }
      },
      error: (err) => {
        console.error('Lỗi khi load SMTP:', err);
      }
    });
  }
  onTestSmtp(): void {
    if (this.smtpForm.invalid) {
      this.message.error('Vui lòng điền đầy đủ và hợp lệ tất cả các trường bắt buộc!');
      this.smtpForm.markAllAsTouched(); // ⚠️ Đánh dấu toàn bộ control để hiển thị lỗi
      return;
    }

    const payload = this.smtpForm.value;

    this.isProcessing = true;
    this.adminService.testSmtpConnection(payload).subscribe({
      next: (result) => {
        if (result.success) {
          this.message.success('✅ Kết nối SMTP thành công.');
        } else {
          this.message.error('Kết nối thất bại. Vui lòng kiểm tra lại cấu hình.');
        }
      },
      error: (err) => {
        this.message.error('Kết nối thất bại. Vui lòng kiểm tra lại cấu hình.');
      }, complete: () => {
      this.isProcessing = false;
    }
    });

  }

  saveSmtpSetting() {
    if (!this.useCustomSmtp) return;
    if (this.smtpForm.invalid) {
      this.message.error('Vui lòng điền đầy đủ và hợp lệ tất cả các trường bắt buộc!');
      this.smtpForm.markAllAsTouched(); // ⚠️ Đánh dấu toàn bộ control để hiển thị lỗi
      return;
    }

    if (!this.user || !this.user.id) return;
    this.adminService.saveSmtpSetting(this.user.id,this.smtpForm.value).subscribe({
      next: () => this.message.success('✅ Cấu hình SMTP đã được lưu!'),
      error: err => this.message.error( err?.error?.message || 'Lỗi khi lưu SMTP')
    });
  }

}
