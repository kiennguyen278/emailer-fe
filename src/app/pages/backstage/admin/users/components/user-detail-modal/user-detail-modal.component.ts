import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NZ_MODAL_DATA, NzModalRef, NzModalService} from 'ng-zorro-antd/modal';
import {UserDTO} from "../../../data/admin.dto";
import {AdminService} from "../../../data/admin.service";
import {ValidatorUtil} from "@core/utils/validator.util";
import {FormUtil} from "@core/utils/form.util";
import {SaveBusinessProfileRequest, SwitchStatusBusinessRequest} from "../../../models";
import {NotificationService} from "@core/services/notification.service";

@Component({
  selector: 'app-user-detail-modal',
  templateUrl: './user-detail-modal.component.html',
})
export class UserDetailModalComponent implements OnInit {

  readonly modalData: {user: UserDTO} = inject(NZ_MODAL_DATA);
  form: FormGroup;

  statusBusinessEmail = false;
  markClose = false; // cái này là dùng để đánh dấu, nếu trong modal đã đổi status thì sau khi close modal phải gọi lại list user ở ngoài

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private modalRef: NzModalRef,
    private notification: NotificationService,
    private modal: NzModalService,
  ) {
    this.buildForm();
    this.form.patchValue({
      businessName: this.user.businessName,
      businessEmail: this.user.businessEmail,
      businessDomain: this.user.domain,
    });
    this.statusBusinessEmail = this.user.statusBusinessEmail == 'ACTIVE'
  }

  get user(): UserDTO {
    return this.modalData.user;
  }
  set user(user: UserDTO) {
    this.modalData.user = user;
  }

  ngOnInit(): void {

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

  buildForm(){
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

}
