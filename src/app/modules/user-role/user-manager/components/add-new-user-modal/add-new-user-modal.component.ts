import { Component, inject, OnInit } from '@angular/core';
import { BaseDestroyComponent } from '@core/components';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { NotificationService } from '@core/services/notification.service';
import { ValidatorUtil } from '@core/utils/validator.util';
import { FormUtil } from '@core/utils/form.util';
import { PHONE_REGEX_TO_ALLOW_INPUT, REGEX_USERNAME_ALLOW_INPUT, SPECIAL_CHARACTERS_REJECT } from '@core/constants';
import { OptionModel } from '@core/models';
import { RoleManagerServices } from '@modules/user-role/role-manager/state/service';
import { takeUntil } from 'rxjs/operators';
import { GetListRoleResponsed, ItemRole } from '@modules/user-role/role-manager/models';
import { isEmpty } from 'lodash';
import { UserManagerServices } from '@modules/user-role/user-manager/state/service';
import { ItemUser, SaveUserRequest, UserDetailResponsed } from '@modules/user-role/user-manager/models';

@Component({
  selector: 'app-add-new-user-modal',
  templateUrl: './add-new-user-modal.component.html',
  providers: [RoleManagerServices, UserManagerServices],
})
export class AddNewUserModalComponent extends BaseDestroyComponent implements OnInit {

  readonly modalData: {user: ItemUser} = inject(NZ_MODAL_DATA);

  get userEdit(){
    return this.modalData.user
  }

  form: FormGroup;

  listRoles: OptionModel[] = [];

  isLoading = false;

  numberRegex = PHONE_REGEX_TO_ALLOW_INPUT;
  REGEX_USERNAME = REGEX_USERNAME_ALLOW_INPUT;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private modalRef: NzModalRef,
    private notification: NotificationService,
    private roleManagerServices: RoleManagerServices,
    private userManagerServices: UserManagerServices,
  ) {
    super()
  }

  ngOnInit() {


    this.buildForm();

    if(this.userEdit){
      this.getDetailUser(this.userEdit)
    }

    this.getListRole();
  }

  getDetailUser(user: ItemUser){
    this.userManagerServices.getDetailUserById(user.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: UserDetailResponsed) => {
          this.patchValueEditUser(res);
        },
      })
  }

  patchValueEditUser(user: UserDetailResponsed){

    const roleList = user?.roles.map(item => item.roleCode) || [];
    const formValue = {
      ...user.user,
      lstRoleCode: roleList
    }
    this.form.patchValue(formValue);
    this.form.controls['code'].disable()
    this.form.controls['userName'].disable()

  }

  submitForm(){

    FormUtil.validate(this.form);

    const formVal = this.form.getRawValue();
    const bodyParams = {
      ...formVal,
      status: Number(formVal.status)
    }

    this.saveUser(bodyParams)

  }

  saveUser(data: SaveUserRequest){
    this.isLoading = true;
    this.userManagerServices.saveUserItem(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.isLoading = false;
          this.notification.open({
            type: 'success',
            content: (this.userEdit ? 'Cập nhật thông tin tài khoản thành công' : 'Tạo mới tài khoản thành công')
          });
          this.modalRef.destroy(true);
        },
        error: (err) => {
          const errMsg = err?.error?.message || (this.userEdit ? 'Đã có lỗi khi cập nhật thông tin tài khoản' : 'Đã có lỗi khi tạo tài khoản');

          this.notification.open({
            type: 'error',
            content: errMsg
          });
          this.isLoading = false;
        },
      });
  }


  closeModal(){
    this.modalRef.destroy();
  }

  buildForm(){
    this.form = this.fb.group({
      id: [null],
      code: [null, [
        ValidatorUtil.required("Mã tài khoản không được để trống"),
        ValidatorUtil.maxLength(20, 'Mã tài khoản không cho phép nhập quá 20 ký tự'),
        ValidatorUtil.patternReject(SPECIAL_CHARACTERS_REJECT, 'Mã tài khoản không cho phép nhập ký tự đặc biệt')
      ]],
      fullName: [null, [ValidatorUtil.required("Tên tài khoản không được để trống"), ValidatorUtil.maxLength(200, 'Tên tài khoản không cho phép nhập quá 200 ký tự')]],
      phoneNumber: [null, [
        ValidatorUtil.required("Số điện thoại không được để trống"),
        ValidatorUtil.phone()]
      ],
      email: [null, [
        ValidatorUtil.required("Email không được để trống"),
        ValidatorUtil.email(),
        ValidatorUtil.maxLength(200, 'Email không cho phép nhập quá 200 ký tự')
      ]],
      userName: [null, [
        ValidatorUtil.required("Tài khoản truy cập không được để trống"),
        ValidatorUtil.maxLength(255, 'Tài khoản truy cập không cho phép nhập quá 255 ký tự'),
        ValidatorUtil.patternReject(SPECIAL_CHARACTERS_REJECT, 'Mã tài khoản không cho phép nhập ký tự đặc biệt')
      ]],
      lstRoleCode: [null, ValidatorUtil.required("Vai trò không được để trống")],
      status: [true, ValidatorUtil.required()],
    });
  }

  getListRole(){
    this.roleManagerServices.getListRoles({page: 0, size: 100, status: 1})
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: GetListRoleResponsed) => {
        if (!isEmpty(res.content)){
          const options: OptionModel[] = res?.content.map((item: ItemRole) => {
            return {
              label: item.roleName,
              value: item.roleCode,
            }
          });
          this.listRoles = options;
        }
      })
  }

}
