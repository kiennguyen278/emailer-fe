import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ColumnConfig } from '@core/models';
import { BaseCrudListComponent } from '@core/components';
import {
  AddNewUserModalComponent
} from '@modules/user-role/user-manager/components/add-new-user-modal/add-new-user-modal.component';
import { getListUser } from '@modules/user-role/user-manager/state/actions';
import {
  selectDataListUser,
  selectLoadingListUser,
  selectTotalListUser
} from '@modules/user-role/user-manager/state/selectors';
import { OptionStatus } from '@core/options';
import { ItemUser } from '@modules/user-role/user-manager/models';
import { isNil, omitBy } from 'lodash';
import { ObjUtil } from '@core/utils/obj.util';
import { Store } from '@ngrx/store';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NotificationService } from '@core/services/notification.service';
import { UserManagerServices } from '@modules/user-role/user-manager/state/service';
import { ActivatedRoute, Router } from '@angular/router';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { takeUntil } from 'rxjs/operators';
import { ConfirmationComponent } from '@shared/components/confirmation/confirmation.component';
import { RoleUser } from '@core/enums';

@Component({
  selector: 'app-user-manager',
  templateUrl: './user-manager.component.html',
})
export class UserManagerComponent extends BaseCrudListComponent implements OnInit {

  @ViewChild(ConfirmationComponent) confirmation: ConfirmationComponent;

  form: FormGroup;
  items: ItemUser[];
  modalRef: NzModalRef;

  constructor(
    store: Store<any>,
    router: Router,
    drawer: NzDrawerService,
    notification: NotificationService,
    modal: NzModalService,
    activatedRoute: ActivatedRoute,
    fb: FormBuilder,
    private userManagerServices: UserManagerServices,
  ) {
    super(store, router, drawer, notification, modal, activatedRoute, fb )
  }

  typeConfirm: 'resetPassword' | 'switchStatusUser' = 'resetPassword';

  optionStatus = OptionStatus;

  columns: ColumnConfig[] = [
    {
      key: 'actions',
      header: 'Thao tác',
      tdClass: 'text-center',
      pipe: 'template',
      nzWidth: '70px',
    },
    {
      key: 'userName',
      header: 'Tên tài khoản',
      nzWidth: '100px',
    },
    {
      key: 'fullName',
      header: 'Tên người dùng',
      nzWidth: '130px',
    },
    {
      key: 'email',
      header: 'Email',
      nzWidth: '230px',
    },
    {
      key: 'phoneNumber',
      header: 'Số điện thoại',
      nzWidth: '130px',
    },
    {
      key: 'status',
      header: 'Trạng thái',
      nzWidth: '100px',
      pipe: 'template'
    },
  ];

  findItemsAction = getListUser;
  selectItems = selectDataListUser;
  selectLoading = selectLoadingListUser;
  selectTotal = selectTotalListUser;

  ngOnInit() {
    this.buildForm();

    super.ngOnInit();

  }


  onDeleteItem(item: any){

  }

  onEditItem(user: ItemUser){
    this.openDialogAddNewRole(user)
  }

  onResetPasswordItem(user: ItemUser){
    (this.typeConfirm = 'resetPassword');
    setTimeout(() => {
      this.confirmation.show(user)
    }, 0)
  }

  confirmResetPassword(user: ItemUser){
    this.userManagerServices.resetPasswordUser(user.userName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notification.open({
            type: 'success',
            content: 'Đặt lại mật khẩu tài khoản thành công'
          });
        },
        error: ({error}) => {
          this.notification.open({
            type: 'error',
            content: error?.message || 'Đã có lỗi khi đặt lại mật khẩu tài khoản'
          });
        }
      })
  }


  onSwitchStatusUser(user: ItemUser){
    (this.typeConfirm = 'switchStatusUser');
    setTimeout(() => {
      this.confirmation.show(user)
    }, 0)

  }

  confirmSwitchStatusUser(user: ItemUser){
    this.userManagerServices.switchStatusUser(user.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if(res === 'Success'){
            this.notification.open({
              type: 'success',
              content: 'Cập nhật trạng thái tài khoản thành công'
            });
            this.findItems();
          }

        },
        error: ({error}) => {
          this.notification.open({
            type: 'error',
            content: error?.message || 'Đã có lỗi khi cập nhật trạng thái tài khoản'
          });
        }
      })
  }


  onSearch(){
    this.findItems();
  }

  onClearSearch(){
    this.form.reset();
    this.findItems();
  }

  buildForm() {
    this.form = this.fb.group({
      userName: [],
      fullName: [],
      status: [],
      phoneNumber: [],
      email: [],
    });

  }


  openDialogAddNewRole(user?: ItemUser) {
    // this.modal.create({
   this.modalRef = this.modal.create({
      nzContent: AddNewUserModalComponent,
      nzData: {
        user: user
      },
      nzFooter: null,
      nzWidth: '680px',
      nzTitle: user ? `Cập nhật tài khoản "${user?.fullName || ''}"` : 'Thêm mới tài khoản' ,
      nzCloseIcon: 'close',
      nzMaskClosable: false
    })

   this.modalRef.afterClose.subscribe((isReload) => {
       if (isReload){
         this.findItems();
       }
     });
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    if (this.modalRef){
      this.modalRef.destroy();
    }
  }

  findItems(payload: any = {}) {
    this.store.dispatch(
      this.findItemsAction({
        payload: {
          params: {...omitBy(this.getParams(), isNil), ...payload},
          body: ObjUtil.deleteNullProp(this.form.getRawValue() || {})
        }
      })
    );
  }

  protected readonly RoleUser = RoleUser;
}
