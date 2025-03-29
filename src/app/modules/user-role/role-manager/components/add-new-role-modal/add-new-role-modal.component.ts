import { Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { BaseDestroyComponent } from '@core/components';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { NotificationService } from '@core/services/notification.service';
import { ValidatorUtil } from '@core/utils/validator.util';
import { FormUtil } from '@core/utils/form.util';
import { ItemRole } from '@modules/user-role/role-manager/models';
import { clearStateSaveRoleItem, saveRoleItem } from '@modules/user-role/role-manager/state/actions';
import {
  selectErrorSaveRoleItem,
  selectLoadingSaveRoleItem,
  selectSuccessSaveRoleItem
} from '@modules/user-role/role-manager/state/selectors';
import { skip, takeUntil } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ItemUser, UserDetailResponsed } from '@modules/user-role/user-manager/models';
import { RoleManagerServices } from '@modules/user-role/role-manager/state/service';
import { REGEX_USERNAME_ALLOW_INPUT, SPECIAL_CHARACTERS_REJECT } from '@core/constants';

@Component({
  selector: 'app-add-new-role-modal',
  templateUrl: './add-new-role-modal.component.html',
})
export class AddNewRoleModalComponent extends BaseDestroyComponent implements OnInit {


  form: FormGroup;
  readonly modalData: {itemRole: ItemRole} = inject(NZ_MODAL_DATA);
  isLoading$: Observable<boolean> = this.store.select(selectLoadingSaveRoleItem);

  REGEX_USERNAME = REGEX_USERNAME_ALLOW_INPUT;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private modalRef: NzModalRef,
    private notification: NotificationService,
    private roleManagerServices: RoleManagerServices,
  ) {
    super()
  }

  get itemRole() {
    return this.modalData.itemRole;
  }

  ngOnInit() {

    this.buildForm();

    if (this.itemRole){
      this.getDetailRole(this.itemRole)
    }


    this.subscribeState();

  }


  getDetailRole(role: ItemRole){
    this.roleManagerServices.getDetailRoleById(role.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: ItemRole) => {
          this.patchValueEditUser(res);
        },
        error: (error) => {
          console.log('error', error)
          this.notification.open({
            type: 'error',
            content: error?.error?.message || 'Đã có lỗi khi lấy thông tin chi tiết vai trò'
          });
          this.modalRef.destroy();
        }
      })
  }

  patchValueEditUser(roleItem: ItemRole){

    this.form.patchValue(roleItem);
    this.form.get('roleCode')?.disable();

  }



  submitForm(){
    FormUtil.validate(this.form);

    const formVal = this.form.getRawValue();

    const payload = {
      ...formVal,
      status: Number(formVal.status)
    }

    this.store.dispatch(saveRoleItem({payload}))
  }


  subscribeState(){

    this.store.select(selectSuccessSaveRoleItem)
      .pipe(skip(1), takeUntil(this.destroy$))
      .subscribe(isSuccess => {
        if (isSuccess){
          this.notification.open({
            type: 'success',
            content: this.itemRole ? 'Cập nhật vai trò thành công' : 'Thêm mới vai trò thành công'
          });
          this.modalRef.destroy(true);
          this.clearStateSaveRole();
        }
      });

    this.store.select(selectErrorSaveRoleItem)
      .pipe(skip(1), takeUntil(this.destroy$))
      .subscribe(err => {
        if (err){
          const msgError = err?.error?.message || (this.itemRole ? 'Đã có lỗi khi cập nhật vai trò' : 'Đã có lỗi khi thêm mới vai trò')
          this.notification.open({
            type: 'error',
            content: msgError
          });
          this.clearStateSaveRole();
        }
      })

  }

  clearStateSaveRole(){
    this.store.dispatch(clearStateSaveRoleItem());
  }


  closeModal(){
    this.modalRef.destroy();
  }

  buildForm(){
    this.form = this.fb.group({
      id: [],
      roleCode: ['', [
        ValidatorUtil.required("Mã vai trò không được để trống"),
        ValidatorUtil.maxLength(50, 'Mã vai trò không cho phép nhập quá 50 ký tự'),
        ValidatorUtil.patternReject(SPECIAL_CHARACTERS_REJECT, 'Mã vai trò không cho phép nhập ký tự đặc biệt')
      ]],
      roleName: ['', [
        ValidatorUtil.required("Tên vai trò không được để trống"),
        ValidatorUtil.maxLength(100, 'Tên vai trò không cho phép nhập quá 100 ký tự')
      ]],
      description: ['', ValidatorUtil.maxLength(500, 'Mô tả không cho phép nhập quá 500 ký tự')],
      status: [1],
    });
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.clearStateSaveRole();
  }

  protected readonly REGEX_USERNAME_ALLOW_INPUT = REGEX_USERNAME_ALLOW_INPUT;
}
