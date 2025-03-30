import { ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SaveSubscriberRequest, SaveTagRequest, SubscriberDTO, TagDTO } from '@modules/subscribers/models';
import { FormUtil } from '@core/utils/form.util';
import { ValidatorUtil } from '@core/utils/validator.util';
import { Store } from '@ngrx/store';
import { SubscribersService } from '@modules/subscribers/state/service';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NotificationService } from '@core/services/notification.service';
import { getListSubscribers, getListTags } from '@modules/subscribers/state/actions';
import { Observable } from 'rxjs';
import {
  selectDataGetSubscriberList,
  selectLoadingGetSubscriberList,
  selectOptionsTagsList, selectTotalItemsGetSubscriberList
} from '@modules/subscribers/state/selectors';
import { ColumnConfig, OptionModel } from '@core/models';
import { UntilDestroy } from '@ngneat/until-destroy';
import { BaseCrudListComponent } from '@core/components';
import { ActivatedRoute } from '@angular/router';
import { isNil, omitBy } from 'lodash';


@UntilDestroy()
@Component({
  selector: 'app-subscriber',
  templateUrl: './subscriber.component.html',
  styleUrls: ['./subscriber.component.scss']
})
export class SubscriberComponent extends BaseCrudListComponent implements OnInit, OnDestroy {

  @ViewChild('modalEditSubscriber') modalEditSubscriber!: TemplateRef<any>;

  tagOptions$: Observable<OptionModel<number>[]> = this.store.select(selectOptionsTagsList); // làm option select ở addnew/edit Subscriber

  constructor(
    store: Store,
    activatedRoute: ActivatedRoute,
    cdr: ChangeDetectorRef,
    private subscribersService: SubscribersService,
    private notification: NotificationService,
    private modal: NzModalService,
    private fb: FormBuilder,
  ) {
    super(store, activatedRoute, cdr);
    this.buildForm();
  }

  form: FormGroup;
  formSearch: FormGroup;
  isLoadingSave = false;
  modalRef: NzModalRef;

  items: SubscriberDTO[] = [];

  columns: ColumnConfig[] = [
    {
      key: 'id',
      header: 'ID',
      sortable: true,
      nzWidth: '50px',
      tdClass: 'text-center',
    },
    {
      key: 'firstName',
      header: 'First Name',
      sortable: true,
      nzWidth: '150px',
    },
    {
      key: 'lastName',
      header: 'Last Name',
      sortable: true,
      nzWidth: '150px',
    },
    {
      key: 'email',
      header: 'Email',
      sortable: true,
      nzWidth: '200px',
    },
    {
      key: 'status',
      header: 'Trạng thái',
      sortable: true,
      nzWidth: '100px',
      tdClass: 'text-center',
    },
    {
      key: 'actions',
      header: 'Thao Tác',
      tdClass: 'text-center',
      pipe: 'template',
      nzWidth: '80px',
    },
  ];

  findItemsAction = getListSubscribers as (arg: { payload: any }) => any;
  selectItems = selectDataGetSubscriberList;
  selectLoading = selectLoadingGetSubscriberList;
  selectTotal = selectTotalItemsGetSubscriberList;
  

  ngOnInit() {
    this.store.dispatch(getListTags());
    super.ngOnInit();

  }


  openModal(item?: SubscriberDTO) {
    if (item?.id){
      this.form.patchValue(item);
    } else {
      this.form.reset();
    }
    this.modalRef = this.modal.create({
      nzTitle: item?.id ? `Cập nhật subscriber "${item.firstName}"` : 'Thêm mới subscriber',
      nzContent: this.modalEditSubscriber,
      nzFooter: null
    });
  }

  showCreateModal(): void {
    this.openModal();
  }

  showEditModal(item: SubscriberDTO): void {
    this.openModal(item);
  }


  saveSubscriber(): void {
    FormUtil.validate(this.form);

    this.isLoadingSave = true;

    const formVal: SaveSubscriberRequest = this.form.getRawValue();
    this.subscribersService.saveSubscribers(formVal).pipe()
      .subscribe({
        next: () => {
          this.notification.open({
            type: 'success',
            content: formVal?.id ? 'Cập nhật subscriber thành công' : 'Thêm subscriber mới thành công'
          })
          this.modalRef.close();
          this.findItems();
          this.isLoadingSave = false;
          this.form.reset();
        },
        error: () => {
          this.notification.open({
            type: 'error',
            content: 'Thao tác thất bại'
          });
          this.isLoadingSave = false;
        }
      });
  }

  closeModal(): void {
    this.form.reset();
    this.modalRef.close();
  }

  confirmDelete(item: SubscriberDTO): void {
    this.modal.confirm({
      nzTitle: `Bạn có chắc muốn xoá subscriber "${item.firstName}"?`,
      nzOkText: 'Xoá',
      nzOkDanger: true,
      nzOnOk: () => this.deleteSubscriber(item.id)
    });
  }

  deleteSubscriber(id: number): void {
    this.subscribersService.deleteSubscriber(id).subscribe({
      next: () => {
        this.notification.open({
          type: 'success',
          content: 'Đã xoá subscriber'
        });

        this.findItems();
      },
      error: () => {
        this.notification.open({
          type: 'error',
          content: 'Xoá subscriber thất bại'
        });
      }
    });
  }

  onSearch(){
    this.findItems();
  }

  buildForm(){
    this.form = this.fb.group({
      id: [null],
      email: [null, [ValidatorUtil.required('Email không được để trống!'), ValidatorUtil.email('Email không đúng định dạng!')]],
      firstName: [null, [ValidatorUtil.required('First Name không được để trống!')]],
      lastName: [null],
      tagIds: [null, [ValidatorUtil.required('Tag không được để trống!')]],
    });

    this.formSearch = this.fb.group({
      keyword: [null],
      tagId: [null],
    })
  }

  getParams() {
    const formSearch = this.formSearch.getRawValue();
    return omitBy(
      {
        ...formSearch,
        page: this.currentPageNum || this.pagination.index,
        size: this.pagination.size,
        ...this.params,
      },
      isNil
    );
  }

  ngOnDestroy() {
    super.ngOnDestroy()
    if (this.modalRef){
      this.modalRef.destroy();
    }
  }

}
