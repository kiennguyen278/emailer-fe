import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd/message';
import {SettingsService} from "../data/settings.service";
import {TokenStorageService} from "@core/services/token-storage.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.less']
})
export class MainComponent implements OnInit {

  // Tab
  activeTabIndex = 0;

  // Business Info
  businessForm!: FormGroup;
  isBusinessEmailVerified = false;

  // SMTP
  smtpForm!: FormGroup;
  useCustomSmtp: boolean | undefined = true;

  // Password
  passwordForm!: FormGroup;

  isProcessing = false;

  constructor(private fb: FormBuilder,
              private message: NzMessageService,
              private tokenStorage: TokenStorageService,
              private router: Router,
              private settingsService: SettingsService) {}

  ngOnInit(): void {
    this.activeTabIndex = 0; // Default: Business Info

    this.initBusinessForm();
    this.initSmtpForm();
    this.initPasswordForm();

    this.loadBusinessInfo();
    this.loadSmtpSetting();
  }

  // TAB EVENT
  onTabChange(index: number): void {
    this.activeTabIndex = index;
    // Nếu cần xử lý khi chuyển tab, xử lý tại đây
  }

  // -------------------- BUSINESS INFO --------------------
  initBusinessForm() {
    this.businessForm = this.fb.group({
      businessName: ['', Validators.required],
      businessDomain: [''],
      businessEmail: ['', [Validators.required, Validators.email]],
      brandModelName: ['Global Digital Business', Validators.required],
      phone:  ['', Validators.required],
      facebookUrl: ['', Validators.required],
      webinarUrl:  ['']
    });
  }

  loadBusinessInfo(): void {
    this.settingsService.getBusinessInfo().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          const data = res.data;
          this.businessForm.patchValue({
            businessName: data.businessName,
            businessEmail: data.businessEmail,
            businessDomain: data.businessDomain,
            brandModelName: data.brandModelName,
            phone: data.phone,
            facebookUrl: data.facebookUrl,
            webinarUrl: data.webinarUrl,
          });
          this.isBusinessEmailVerified = data.isVerified ?? false;
          this.useCustomSmtp = data.useCustomSmtp;

          if (this.isBusinessEmailVerified) {
            this.businessForm.get('businessEmail')?.disable();
          }

        } else {
          console.warn('Không có dữ liệu thông tin doanh nghiệp');
        }
      },
      error: (err) => {
        console.error('Lỗi khi lấy thông tin doanh nghiệp:', err);
      }
    });
  }

  saveBusinessInfo() {
    if (this.businessForm.invalid) {
      this.message.error('Vui lòng điền đầy đủ và hợp lệ tất cả các trường bắt buộc!');
      this.businessForm.markAllAsTouched();
      return;
    }

    this.isProcessing = true;
    this.settingsService.updateBusinessInfo(this.businessForm.value).subscribe({
      next: (res) => {
        const msg = res?.message || '✅ Cập nhật thông tin thành công!';
        this.message.success(msg);
      },
      error: err => {
        const msg = err?.error?.message || '❌ Lỗi khi cập nhật thông tin doanh nghiệp!';
        this.message.error(msg);
      },
      complete: () => {
        this.isProcessing = false;
      }
    });
  }


  // -------------------- SMTP --------------------
  initSmtpForm() {
    this.smtpForm = this.fb.group({
      provider: ['office365', Validators.required],
      smtpServer: ['smtp.office365.com', Validators.required],
      smtpPort: [587, Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.smtpForm.get('provider')?.valueChanges.subscribe((provider) => {
      if (provider.toLowerCase()  === 'office365') {
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
      if (provider.toLowerCase()  === 'office365' && port !== 587) {
        this.smtpForm.patchValue({ smtpPort: 587 });
      }
    });

  }

  lastTestResult: string | undefined;
  lastTestedAt: string | undefined;

  loadSmtpSetting(): void {
    this.settingsService.getSmtpSetting().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.smtpForm.patchValue({
            ...res.data,
            provider: res.data.provider?.toLowerCase() || null
          });

          // Gán test result ra biến hiển thị
          this.lastTestResult = res.data.lastTestResult;
          this.lastTestedAt = res.data.lastTestedAt;
        } else {
          console.warn('Không tìm thấy cấu hình SMTP');
        }
      },
      error: (err) => {
        console.error('Lỗi khi load SMTP:', err);
      }
    });
  }

  onToggleCustomSmtp(enabled: boolean): void {
    this.useCustomSmtp = enabled;
    this.settingsService.updateCustomSmtpStatus(enabled).subscribe({
      next: res => {
        this.message.success(res.message || 'Cập nhật trạng thái SMTP thành công!');
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


  onTestSmtp(): void {
    if (this.smtpForm.invalid) {
      this.message.error('Vui lòng điền đầy đủ và hợp lệ tất cả các trường bắt buộc!');
      this.smtpForm.markAllAsTouched(); // ⚠️ Đánh dấu toàn bộ control để hiển thị lỗi
      return;
    }

    const payload = this.smtpForm.value;
    this.isProcessing = true;
    this.settingsService.testSmtpConnection(payload).subscribe({
      next: (result) => {
        if (result.success) {
          this.message.success('✅ Kết nối SMTP thành công.');
        } else {
          this.message.error('Kết nối thất bại. Vui lòng kiểm tra lại cấu hình.');
        }
      },
      error: (err) => {
        this.message.error('Kết nối thất bại. Vui lòng kiểm tra lại cấu hình.');
      },
      complete: () => {
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

    this.isProcessing = true;
    this.settingsService.saveSmtpSetting(this.smtpForm.value).subscribe({
      next: () => {
        this.message.success('✅ Cấu hình SMTP đã được lưu!')
      } ,
      error: err => {
        this.message.error( err?.error?.message || 'Lỗi khi lưu SMTP')
      } ,
      complete: () => {
        this.isProcessing = false;
      }
    });
  }

  // -------------------- PASSWORD --------------------
  initPasswordForm() {
    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  changePassword() {
    if (this.passwordForm.invalid) {
      this.message.error('Vui lòng điền đầy đủ và hợp lệ tất cả các trường bắt buộc!');
      this.passwordForm.markAllAsTouched(); // ⚠️ Đánh dấu toàn bộ control để hiển thị lỗi
      return;
    }

    const { newPassword, confirmPassword } = this.passwordForm.value;
    if (newPassword !== confirmPassword) {
      this.message.error('Mật khẩu nhập lại không khớp!');
      return;
    }
    this.settingsService.changePassword(this.passwordForm.value).subscribe({
      next: () => {
        this.message.success('✅ Mật khẩu đã được đổi!');
        this.tokenStorage.clearLocalStore();
        this.router.navigate(['/auth/login']);
      },
      error: err => this.message.error(err?.error?.message || 'Đổi mật khẩu thất bại')
    });
  }

  isSmtpFormVisible(): boolean {
    return !!this.useCustomSmtp;
  }

}
