import { AfterViewInit, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { BaseCrudListComponent, BaseDestroyComponent } from '@core/components';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { NotificationService } from '@core/services/notification.service';
import { NZ_MODAL_DATA, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { FormBuilder } from '@angular/forms';
import { ColumnConfig } from '@core/models';
import { clearStateListUserAddToRole, getListUserAddToRole } from '@modules/user-role/role-manager/state/actions';
import {
  selectDataListUserAddToRole,
  selectLoadingListUserAddToRole,
  selectTotalListUserAddToRole
} from '@modules/user-role/role-manager/state/selectors';
import { ItemRole } from '@modules/user-role/role-manager/models';
import { isNil, omitBy } from 'lodash';
import { RoleManagerServices } from '@modules/user-role/role-manager/state/service';
import { takeUntil } from 'rxjs';
import { ItemUser } from '@modules/user-role/user-manager/models';

@Component({
  selector: 'app-add-user-to-role-modal',
  templateUrl: './add-user-to-role-modal.component.html',
})
export class AddUserToRoleModalComponent extends BaseCrudListComponent implements OnInit{


  readonly modalData: {crrRole: ItemRole} = inject(NZ_MODAL_DATA);

  isLoadingSave = false;
  items: ItemUser[] = [];

  constructor(
    store: Store<any>,
    router: Router,
    drawer: NzDrawerService,
    notification: NotificationService,
    modal: NzModalService,
    activatedRoute: ActivatedRoute,
    fb: FormBuilder,
    private modalRef: NzModalRef,
    private roleManagerServices: RoleManagerServices,
  ) {
    super(store, router, drawer, notification, modal, activatedRoute, fb);
  }

  selectedKeys: string[] = [];

  columns: ColumnConfig[] = [
    {
      key: 'userName',
      header: 'Tên tài khoản',
      nzWidth: '100px',
    },
    {
      key: 'fullName',
      header: 'Tên người dùng',
      nzWidth: '100px',
    },
    {
      key: 'email',
      header: 'Email',
      nzWidth: '130px',
    },
    {
      key: 'phoneNumber',
      header: 'Số điện thoại',
      nzWidth: '80px',
    },
  ];


  findItemsAction = getListUserAddToRole;
  selectItems = selectDataListUserAddToRole;
  selectLoading = selectLoadingListUserAddToRole;
  selectTotal = selectTotalListUserAddToRole;

  get crrRole(){
    return this.modalData.crrRole;
  }

  ngOnInit() {
    super.ngOnInit();

  }



  saveAddUserToRole(){
    this.isLoadingSave = true;
    const body = {
      lstUsername: this.selectedKeys,
      roleCode: this.crrRole.roleCode
    }
    this.roleManagerServices.saveUserAddToRole(body)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if(res === 'Success')
          this.isLoadingSave = false;
          this.notification.open({
            type: 'success',
            content: 'Người dùng đã được thêm vào vai trò thành công'
          });
          this.modalRef.destroy(true);
        },
        error: ({error}) => {
          this.isLoadingSave = false
          this.notification.open({
            type: 'error',
            content: error?.message || 'Đã có lỗi khi thêm người dùng vào vai trò'
          })
        }
      })
  }

  onSelectKeysChange(keys: string[]){
    this.selectedKeys = keys
  }


  onDbClickItem(item: any) {

    console.log('onDbClickItem', item)
  }

  onSelectedItem(items: any[]) {
    console.log('onSelectedItem', items);
  }



  onDeleteItem(item: any){

  }

  onEditItem(item: any){

  }


  closeModal(){
    this.modalRef.destroy();
  }

  getParams() {
    // param của get user add to role chỉ cần roleCode, ko cần pagination, get all luôn
    return {roleCode: this.crrRole.roleCode};
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.store.dispatch(clearStateListUserAddToRole());
  }

}
