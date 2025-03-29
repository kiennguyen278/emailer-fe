import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ColumnConfig } from '@core/models';
import { BaseCrudListComponent } from '@core/components';
import { getListUserInRole, loadListRole } from '@modules/user-role/role-manager/state/actions';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  selectDataListUserInRole,
  selectLoadingListUserInRole, selectRoleToGetUser,
  selectTotalListUserRole
} from '@modules/user-role/role-manager/state/selectors';
import {
  AddUserToRoleModalComponent
} from '@modules/user-role/role-manager/components/add-user-to-role-modal/add-user-to-role-modal.component';
import { filter, map, skip, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ItemRole } from '@modules/user-role/role-manager/models';
import { isEmpty, isNil, omitBy } from 'lodash';
import { ItemUser } from '@modules/user-role/user-manager/models';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { NotificationService } from '@core/services/notification.service';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { RoleManagerServices } from '@modules/user-role/role-manager/state/service';
import { ValueOptionStatus } from '@core/options';

@Component({
  selector: 'app-user-in-role',
  templateUrl: './user-in-role.component.html',
})
export class UserInRoleComponent extends BaseCrudListComponent implements OnInit{

  form: FormGroup;

  selectedKeys: string[] = [];
  selectedRole: ItemRole;
  modalRef: NzModalRef;
  modalConfirmDelete: NzModalRef;
  valueOptionStatus = ValueOptionStatus;

  constructor(
    store: Store<any>,
    router: Router,
    drawer: NzDrawerService,
    notification: NotificationService,
    modal: NzModalService,
    activatedRoute: ActivatedRoute,
    fb: FormBuilder,
    private roleManagerServices: RoleManagerServices,
  ) {
    super(store, router, drawer, notification, modal, activatedRoute, fb);
  }

  columns: ColumnConfig[] = [
    {
      key: 'actions',
      header: 'Thao tác',
      tdClass: 'text-center',
      pipe: 'template',
      nzWidth: '40px',
    },
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


  findItemsAction = getListUserInRole;
  selectItems = selectDataListUserInRole;
  selectLoading = selectLoadingListUserInRole;
  selectTotal = selectTotalListUserRole;

   ngOnInit() {
    this.buildForm();
    super.onInitFn();

    this.store.select(selectRoleToGetUser)
      .pipe(skip(1), takeUntil(this.destroy$))
      .subscribe((item: ItemRole) => {

        this.selectedRole = item;
        if (!isEmpty(item)){
          this.findItems({roleCode: item.roleCode});
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


  onSearch(){
    this.findItems();
  }

  buildForm() {
    this.form = this.fb.group({
      keyword: [''],
    });

  }

  openModalConfirmDeleteUserInRole(user: ItemUser){
    this.modalConfirmDelete = this.modal.confirm({
      nzTitle: "Xóa nguười dùng khỏi vai trò",
      nzContent: `Bạn có chắc chắn muốn xóa người dùng <span class="font-500">${user.fullName}</span> khỏi vai trò <span class="font-500">${this.selectedRole.roleName}</span>?`,
      nzOkText: 'OK',
      nzWrapClassName: 'modalConfirm',
      nzIconType: '',
      nzOnOk: () => this.deleteUserFromRole(user),
    });

    return;
  }

  deleteUserFromRole(user: ItemUser){

    this.modalConfirmDelete.updateConfig({nzOkLoading: true});

    const body = {
      userName: user.userName,
      roleCode: this.selectedRole.roleCode
    }
    this.roleManagerServices.deleteUserFromRole(body)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.notification.open({
            type: 'success',
            content: 'Người dùng đã được xóa khỏi vào vai trò thành công'
          });
          this.findItems();
          this.modalConfirmDelete.destroy();
        },
        error: ({error}) => {
          this.notification.open({
            type: 'error',
            content: error?.message || 'Đã có lỗi khi xóa người dùng khỏi vai trò'
          });
          this.modalConfirmDelete.updateConfig({nzOkLoading: false});
        }
      });
    return false;
  }

  openDialogAddUserToRole() {
     if (this.selectedRole?.status === this.valueOptionStatus.HetHieuLuc){
       return;
     }
    this.modalRef = this.modal.create({
      nzContent: AddUserToRoleModalComponent,
      nzData: {
        crrRole: this.selectedRole
      },
      nzFooter: null,
      nzWidth: '900px',
      nzTitle: `Thêm mới người dùng vào vai trò "${this.selectedRole?.roleName || ''}"`,
      nzCloseIcon: 'close',
      nzMaskClosable: false
    });

    this.modalRef.afterClose.subscribe(isReload => {
      if (isReload){
        this.findItems();
      }
    });
  }


  getParams() {
    return omitBy(
      {
        ...this.form.getRawValue(),
        roleCode: this.selectedRole?.roleCode,
        page: this.currentPageNum || this.pagination.index,
        size: this.pagination.size,
        ...this.params
      },
      isNil
    );
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    if (this.modalRef){
      this.modalRef.destroy();
    }

  }

}
