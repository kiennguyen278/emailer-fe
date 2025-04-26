import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NZ_MODAL_DATA, NzModalRef} from 'ng-zorro-antd/modal';
import {UserDTO} from "../../../data/admin.dto";
import {AdminService} from "../../../data/admin.service";
import {SequenceDTO} from "../../../../email/models";
import {ValidatorUtil} from "@core/utils/validator.util";
import {FormUtil} from "@core/utils/form.util";
import {SaveBusinessProfileRequest} from "../../../models";
import {NotificationService} from "@core/services/notification.service";

@Component({
  selector: 'app-user-detail-modal',
  templateUrl: './user-detail-modal.component.html',
})
export class UserDetailModalComponent implements OnInit {


  readonly modalData: {user: UserDTO} = inject(NZ_MODAL_DATA);
  form: FormGroup;

  selectedUser: UserDTO | null = null;
  activeTabIndex = 0;

  statusOptions = [
    { label: 'ACTIVE', value: 'ACTIVE' },
    { label: 'INACTIVE', value: 'INACTIVE' }
  ];

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private modalRef: NzModalRef,
    private notification: NotificationService,
  ) {
    this.buildForm();
    this.form.patchValue({
      businessName: this.user.businessName,
      businessEmail: this.user.businessEmail,
      businessDomain: this.user.domain,
      statusBusinessEmail: this.user.statusBusinessEmail == 'VERIFIED',
    })
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
    console.log(this.form.getRawValue());
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
      statusBusinessEmail: [0],
    });

  }


  closeModal(): void {
    this.modalRef.destroy();
  }

  updateBusinessStatus(): void {
    if (!this.selectedUser || this.selectedUser.id == null) return;
    const dto = {
      id: this.selectedUser.id,
      statusBusinessEmail: this.selectedUser.statusBusinessEmail
    };
    this.adminService.updateBusinessStatus(this.selectedUser.id,dto).subscribe();
  }
}
