import { ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { FormUtil } from '@core/utils/form.util';
import { ValidatorUtil } from '@core/utils/validator.util';
import { Store } from '@ngrx/store';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NotificationService } from '@core/services/notification.service';
import {Observable, of} from 'rxjs';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ActivatedRoute } from '@angular/router';
import { isNil, omitBy } from 'lodash';
import {BaseCrudListComponent} from "@core/components";
import {OptionModel} from "@core/models/option.model";
import {
  selectDataGetSubscriberList,
  selectLoadingGetSubscriberList,
  selectOptionsTagsList, selectTotalItemsGetSubscriberList
} from "../../state/selectors";
import {SubscribersService} from "../../state/service";
import {SaveSubscriberRequest, SubscriberDTO} from "../../models";
import {ColumnConfig} from "@core/models/column-config.model";
import {getListSubscribers, getListTags} from "../../state/actions";
import { NzMessageService } from 'ng-zorro-antd/message';



@UntilDestroy()
@Component({
  selector: 'app-subscriber',
  templateUrl: './subscriber.component.html',
  styleUrls: ['./subscriber.component.scss']
})
export class SubscriberComponent extends BaseCrudListComponent implements OnInit, OnDestroy {

  @ViewChild('modalEditSubscriber') modalEditSubscriber!: TemplateRef<any>;
  @ViewChild('modalViewSubscriber') modalViewSubscriber!: TemplateRef<any>;

  @ViewChild('modalImportSubscriber') modalImportSubscriber!: TemplateRef<any>;

  formImport!: FormGroup;
  isLoadingImport = false;
  selectedFile: File | null = null;

  tagOptions$: Observable<OptionModel<number>[]> = this.store.select(selectOptionsTagsList); // làm option select ở addnew/edit Subscriber

  subscriberStatusOptions$ = of([
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Inactive', value: 'INACTIVE' },
    { label: 'Unsubscribed', value: 'UNSUBSCRIBED' },
    { label: 'Bounce', value: 'HARD_BOUNCE' },
    { label: 'Complaint', value: 'COMPLAINT' }
  ]);


  form: FormGroup;
  formSearch: FormGroup;
  isLoadingSave = false;
  modalRef: NzModalRef;

  items: SubscriberDTO[] = [];

  columns: ColumnConfig[] = [
    {
      key: 'email',
      header: 'Email',
      sortable: true,
      tdClass: 'text-center',
      nzWidth: '200px',
    },

    {
      key: 'firstName',
      header: 'Name',
      sortable: true,
      tdClass: 'text-center',
      nzWidth: '150px',
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


  constructor(
    store: Store,
    activatedRoute: ActivatedRoute,
    cdr: ChangeDetectorRef,
    private subscribersService: SubscribersService,
    private notification: NotificationService,
    private modal: NzModalService,
    private fb: FormBuilder,
    private message: NzMessageService, // ✅ thêm dòng này
  ) {
    super(store, activatedRoute, cdr);
    this.buildForm();
  }


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

  showImportModal() {
    this.modal.create({
      nzTitle: 'Import Subscribers từ CSV',
      nzContent: this.modalImportSubscriber,
      nzFooter: null,
      nzWidth: 600
    });
  }

  closeImportModal() {
    this.formImport.reset();
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedFile = target.files[0]; // ✅ lưu file
    }
  }


  importSubscribers(): void {
    if (!this.selectedFile) {
      this.message.warning('📎 Vui lòng chọn file CSV để import!');
      return;
    }

    const tagId = this.formImport.get('tagId')?.value;
    this.isLoadingImport = true;

    this.subscribersService.importCSV(this.selectedFile, tagId).subscribe({
      next: (res) => {
        if (res.success) {
          const errorLines: string[] = res.data?.errorLines || [];
          const totalLines: number = res.data?.totalLines || 0;
          const successCount = totalLines - errorLines.length;

          // ✅ Hiển thị tổng quan kết quả import
          this.message.success(`✅ Import thành công: ${successCount}/${totalLines} dòng hợp lệ`);

          // ✅ Nếu có lỗi, show bảng lỗi chi tiết
          if (errorLines.length > 0) {
            this.showImportErrors(errorLines);
          }

          this.closeImportModal();
        } else {
          this.message.error(res.message || '❌ Import thất bại!');
        }
      },
      error: (err) => {
        console.error(err);
        this.message.error('🚫 Lỗi kết nối hoặc định dạng không hợp lệ!');
      },
      complete: () => {
        this.isLoadingImport = false;
      }
    });
  }


  showImportErrors(errorLines: string[]): void {
    this.modal.create({
      nzTitle: '⚠️ Một số dòng bị lỗi khi import',
      nzContent: `
      <div style="max-height: 300px; overflow-y: auto">
        <ul style="padding-left: 1em">
          ${errorLines.map(line => `<li style="margin-bottom: 4px;">${line}</li>`).join('')}
        </ul>
      </div>
    `,
      nzClosable: true,
      nzOkText: 'Đã hiểu',
      nzWidth: 600
    });
  }

  showCreateModal(): void {
    this.openModal();
  }

  showEditModal(item: SubscriberDTO): void {
    this.openModal(item);
  }

  summary = {
    total: 1540,
    openRate: 38.6,
    clickRate: 12.4,
    unsubscribed: 123,
    complainRate: 1.2
  };


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

    // subcriber form
    this.form = this.fb.group({
      id: [null],
      email: [null, [ValidatorUtil.required('Email không được để trống!'), ValidatorUtil.email('Email không đúng định dạng!')]],
      firstName: [null, [ValidatorUtil.required('First Name không được để trống!')]],
      lastName: [null],
      tagIds: [null],
    });

    // search form
    this.formSearch = this.fb.group({
      status: ['ACTIVE'], // giá trị mặc định
      keyword: [null],
      tagId: [null],
    })

    // import form
    this.formImport = this.fb.group({
      file: [null, Validators.required],
      tagId: [null],
    });

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

  isViewModalVisible = false;

  selectedSubscriber = {
    status: 'ACTIVE',
    email: 'alice@example.com',
    firstName: 'Alice',
    lastName: 'Nguyen',
    tags: ['Welcome', 'Onboarding'],
    stats: {
      emailsReceived: 45,
      opens: 32,
      clicks: 14
    },
    emailHistory: [
      { subject: 'Welcome to our platform!', sentAt: '2025-03-20', status: 'Opened' },
      { subject: 'Discover new features', sentAt: '2025-03-22', status: 'Clicked' },
      { subject: 'Weekly Digest', sentAt: '2025-03-28', status: 'Sent' }
    ],
    workflows: [
      { name: 'Onboarding Flow', startedAt: '2025-03-20', status: 'In Progress' },
      { name: 'Nurture Series', startedAt: '2025-03-25', status: 'Completed' }
    ],
    sequences: [
      { title: 'Getting Started Guide', step: 'Step 2 of 5', lastSent: '2025-03-24' }
    ],
    campaigns: [
      { name: 'Spring Promo', sentDate: '2025-03-15', openRate: 52.3 }
    ]
  };

  showViewModal(subscriber: any) {
    console.log('Subscriber được xem chi tiết:', subscriber); // để debug

    this.modal.create({
      nzTitle: 'Chi tiết Subscriber',
      nzContent: this.modalViewSubscriber,
      nzWidth: 1024,
      nzFooter: null
    });

    //this.selectedSubscriber = this.selectedSubscriber; // hoặc load subscriber thực tế ở đây
    this.isViewModalVisible = true;
  }

  closeViewModal() {
    this.isViewModalVisible = false;
  }


}
