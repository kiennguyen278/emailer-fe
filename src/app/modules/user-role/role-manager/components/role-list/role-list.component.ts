import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ColumnConfig } from '@core/models';
import { BaseCrudListComponent } from '@core/components';
import {
  clearStateListUserInRole,
  loadListRole,
  setSelectRoleToGetUser
} from '@modules/user-role/role-manager/state/actions';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  selectDataListRole,
  selectLoadingListRole,
  selectTotalListRole
} from '@modules/user-role/role-manager/state/selectors';
import {
  AddNewRoleModalComponent
} from '@modules/user-role/role-manager/components/add-new-role-modal/add-new-role-modal.component';
import { isEmpty, isNil, omitBy } from 'lodash';
import { ItemRole } from '@modules/user-role/role-manager/models';
import { skip, takeUntil, tap } from 'rxjs/operators';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
})
export class RoleListComponent extends BaseCrudListComponent implements OnInit{

  form: FormGroup;
  items: ItemRole[] = [];
  selectedKeys: string[] = [];
  modalRef: NzModalRef;

  columns: ColumnConfig[] = [
    {
      key: 'actions',
      header: 'Thao tác',
      tdClass: 'text-center',
      pipe: 'template',
      nzWidth: '44px',
    },
    {
      key: 'roleCode',
      header: 'Mã vai trò',
      nzWidth: '80px',
    },
    {
      key: 'roleName',
      header: 'Tên vai trò',
      nzWidth: '100px',
    },
    {
      key: 'description',
      header: 'Mô tả',
      nzWidth: '150px',
    },
  ];

  findItemsAction = loadListRole;
  selectItems = selectDataListRole;
  selectLoading = selectLoadingListRole;
  selectTotal = selectTotalListRole;

  ngOnInit() {
    this.buildForm();
    super.ngOnInit();


    this.store.select(this.selectItems)
      .pipe(skip(1), takeUntil(this.destroy$),
        tap(items => {
          if (isEmpty(items)){
            this.store.dispatch(clearStateListUserInRole());
            this.store.dispatch(setSelectRoleToGetUser({payload: {} as ItemRole}));
          }
        })).subscribe()

  }


  onSelectKeysChange(keys: string[]){
    this.selectedKeys = keys
  }


  onDbClickItem(item: ItemRole) {

    console.log('onDbClickItem', item)
  }
  onClickItem(item: ItemRole) {
    this.store.dispatch(setSelectRoleToGetUser({payload: item}))
  }

  onSelectedItem(items: ItemRole[]) {
    console.log('onSelectedItem', items);
  }



  onDeleteItem(item: ItemRole, event: Event){

    event.preventDefault();
  }

  onEditItem(item: ItemRole){
    this.openDialogAddNewRole(item)
  }


  onSearch(){
    this.findItems()
  }

  buildForm() {
    this.form = this.fb.group({
      keyword: [''],
    });

  }

  getParams() {
    const formSearch = this.form.getRawValue();
    return omitBy(
      {
        ...formSearch,
        page: this.currentPageNum || this.pagination.index,
        size: this.pagination.size,
        ...this.params
      },
      isNil
    );
  }

  openDialogAddNewRole(roleEdit?: ItemRole) {
    this.modalRef = this.modal.create({
      nzContent: AddNewRoleModalComponent,
      nzData: {
        itemRole: roleEdit,
      },
      nzFooter: null,
      nzWidth: '580px',
      nzTitle: roleEdit ? `Cập nhật vai trò "${roleEdit?.roleName || ''}"` : 'Thêm mới vai trò',
      nzCloseIcon: 'close',
      nzMaskClosable: false
    });

    this.modalRef.afterClose.subscribe((isLoading) => {
        if (isLoading){
          // khi close modal sẽ trả ra 1 value true/false (để biết là destroy cancel hay save), nếu có trả về true thì reload lại
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


}
