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
import {cloneDeep, isNil, omitBy, pick} from 'lodash';
import {BaseCrudListComponent} from "@core/components";
import {OptionModel} from "@core/models/option.model";
import {
  selectDataGetSubscriberList,
  selectLoadingGetSubscriberList,
  selectOptionsTagsList, selectTotalItemsGetSubscriberList
} from "../../state/selectors";
import {SubscribersService} from "../../state/service";
import {SaveSubscriberRequest, SubscriberDetailDTO, SubscriberDTO, SubscriberStatsDTO} from "../../models";
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

  pieChartOptions: any;
  progressData: { label: string; value: number; color: string }[] = [];

  formImport!: FormGroup;
  isLoadingImport = false;
  selectedFile: File | null = null;

  tagOptions$: Observable<OptionModel<number>[]> = this.store.select(selectOptionsTagsList); // làm option select ở addnew/edit Subscriber

  //  PENDING,ACTIVE, INACTIVE, UNSUBSCRIBED, BOUNCED
  subscriberStatusOptions: OptionModel[] = [
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Pending', value: 'PENDING' },
    { label: 'Inactive', value: 'INACTIVE' },
    { label: 'Unsubscribed', value: 'UNSUBSCRIBED' },
    { label: 'Bounced', value: 'BOUNCED' }
  ];

  subscriberStatusOptionsEdit: OptionModel[] = [...this.subscriberStatusOptions];

  overviewStats: SubscriberStatsDTO | null = null;

  form: FormGroup;
  formSearch: FormGroup;
  isLoadingSave = false;
  modalEditSubcriberRef: NzModalRef;
  modalImportSubcriberRef: NzModalRef;

  items: SubscriberDTO[] = [];

  columns: ColumnConfig[] = [
    {
      key: 'email',
      header: 'Email',
      sortable: true,
      tdClass: 'text-center',
      nzWidth: '150px',
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
      pipe: 'optionLabel',
      filter: {
        options: this.subscriberStatusOptions
      }
    },

    {
      key: 'sourceType',
      header: 'Source Type',
      sortable: true,
      tdClass: 'text-center',
      nzWidth: '100px',
    },

    {
      key: 'actions',
      header: 'Thao Tác',
      tdClass: 'text-center',
      pipe: 'template',
      nzWidth: '100px',
    },
  ];


  isViewModalVisible = false;

  selectedSubscriber: SubscriberDetailDTO | null = null;
  checkboxSelectedSubscriber: SubscriberDTO[] = [];

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
    this.loadOverviewStats();
  }


  loadOverviewStats(): void {
    this.subscribersService.getOverviewStats().subscribe(res => {
      if (res.success) {
        this.overviewStats = res.data;
      }
    });
  }

  openModal(item?: SubscriberDetailDTO) {
    // item?: SubscriberDetailDTO lấy từ response API getSubscriberDetail chứ ko lấy từ item từ ngoài list truyền vào nữa
    if (item?.subscriberId){
      const tagIds = item.tags.map(item => item.id);
      this.form.patchValue({
        ...item,
        id: item.subscriberId,
        tagIds: tagIds
      });

      switch (item.status) {
        case 'ACTIVE':
          this.subscriberStatusOptionsEdit = this.subscriberStatusOptions.filter(option => ['ACTIVE', 'INACTIVE', 'UNSUBSCRIBED'].includes(option.value));
          break;

        case 'INACTIVE':
          this.subscriberStatusOptionsEdit = this.subscriberStatusOptions.filter(option => ['ACTIVE', 'INACTIVE'].includes(option.value));
          break;

        case 'PENDING':
          this.subscriberStatusOptionsEdit = this.subscriberStatusOptions.filter(option => ['ACTIVE', 'INACTIVE', 'UNSUBSCRIBED', 'PENDING'].includes(option.value));
          break;

        default:
          this.subscriberStatusOptionsEdit = this.subscriberStatusOptions.filter(option => item.status == option.value);
          break;

      }

      this.form.controls['email'].disable();
    } else {
      this.subscriberStatusOptionsEdit = this.subscriberStatusOptions.filter(option => ['ACTIVE', 'PENDING'].includes(option.value));
      this.form.reset({status: 'ACTIVE'});
      this.form.controls['email'].enable();
    }

    this.modalEditSubcriberRef = this.modal.create({
      nzTitle: item?.subscriberId ? `Cập nhật subscriber "${item.firstName}"` : 'Thêm mới subscriber',
      nzContent: this.modalEditSubscriber,
      nzFooter: null
    });
  }

  showImportModal() {
    this.modalImportSubcriberRef = this.modal.create({
      nzTitle: 'Import Subscribers từ CSV',
      nzContent: this.modalImportSubscriber,
      nzFooter: null,
      nzWidth: 600
    });

  }

  closeImportModal(): void {
    this.isLoadingImport = false;
    this.formImport.reset();
    this.modalImportSubcriberRef.destroy();
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedFile = target.files[0]; // ✅ lưu file
    }
  }

  importSubscribers(): void {

    if (!this.selectedFile) {
      this.message.error('Vui lòng chọn file CSV để import!');
      return;
    }
    const tagId = this.formImport.get('tagId')?.value;
    if (!tagId) {
      this.message.error('Vui lòng chọn tag để import!');
      return;
    }

    this.isLoadingImport = true;

    this.subscribersService.importCSV(this.selectedFile, tagId).subscribe({
      next: (res) => {
        if (res.success) {
          const errorLines: string[] = res.data?.errorLines || [];
          const totalLines: number = res.data?.totalLines || 0;
          const successCount = totalLines - errorLines.length;

          const msg = `✅ Import thành công: ${successCount}/${totalLines} dòng hợp lệ`

          // ✅ Nếu có lỗi, show bảng lỗi chi tiết
          if (errorLines.length > 0) {
            this.showImportErrors(errorLines, msg);
          } else {
            // ✅ Hiển thị tổng quan kết quả import
            this.message.success(msg);
          }

          this.closeImportModal();
        } else {
          this.message.error(res.message || '❌ Import thất bại!');
        }
      },
      error: (err) => {
        this.message.error('Lỗi kết nối hoặc định dạng không hợp lệ!');
      },
      complete: () => {
        this.isLoadingImport = false;
      }
    });
  }

  showImportErrors(errorLines: string[], msg: string): void {
    this.modal.create({
      nzTitle: msg,
      nzContent: `
      <div style="max-height: 300px; overflow-y: auto">
        <ul style="padding-left: 1em; margin-top: 10px">
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
    this.subscribersService.getSubscriberDetail(item.id).subscribe({
      next: (res) => {
        if (res.success) {
          this.openModal(res.data);
        }
      },
      error: () => {
        this.message.error('Lỗi khi tải chi tiết subscriber!');
      }
    });

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
          this.modalEditSubcriberRef.close();
          this.findItems();
          this.isLoadingSave = false;
          this.form.reset();
        },
        error: ({error}) => {
          this.notification.open({
            type: 'error',
            content: error?.message || 'Có lỗi khi cập nhật subscriber'
          });
          this.isLoadingSave = false;
        }
      });
  }

  closeModal(): void {
    this.form.reset();
    this.modalEditSubcriberRef.close();
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
      error: ({error}) => {
        this.notification.open({
          type: 'error',
          content: error?.message || 'Xoá subscriber thất bại'
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
      status: ['ACTIVE'],
    });

    // search form
    this.formSearch = this.fb.group({
      status: ['ACTIVE'], // giá trị mặc định
      tagId: [null],
      query: [null],
    })

    // import form
    this.formImport = this.fb.group({
      file: [null, Validators.required],
      tagId: [null, Validators.required]
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
    if (this.modalEditSubcriberRef){
      this.modalEditSubcriberRef.destroy();
    }
    if (this.modalImportSubcriberRef){
      this.modalImportSubcriberRef.destroy();
    }
  }

  onSelectedItem(items: SubscriberDTO[]): void {
    this.checkboxSelectedSubscriber = items;
  }


  confirmBulkDelete(items: SubscriberDTO[]): void {
    this.modal.confirm({
      nzTitle: `Bạn có chắc muốn xoá danh sách subscriber đang chọn?`,
      nzOkText: 'Xoá',
      nzOkDanger: true,
      nzOnOk: () => this.onBulkDelete(items)
    });
  }

  onBulkDelete(items: SubscriberDTO[]): void {

    const ids: number[] = items.map(item => item.id);

    this.subscribersService.bulkDeleteSubscriber(ids).subscribe({
      next: (res) => {
        if (res.success) {
          this.checkboxSelectedSubscriber = [];
          this.notification.open({
            type: 'success',
            content: res.message || 'Đã xoá danh sách subscriber đã chọn'
          });
          this.findItems();
        }
      },
      error: ({error}) => {
        this.notification.open({
          type: 'error',
          content: error?.message || 'Có lỗi khi xóa danh sách subscriber'
        })
      }
    });


  }

  showViewModal(subscriber: any): void {
    this.selectedSubscriber = null; // clear trước
    this.isViewModalVisible = false;

    this.subscribersService.getSubscriberDetail(subscriber.id).subscribe({
      next: (res) => {
        if (res.success) {
          this.selectedSubscriber = res.data;

          // ✅ Sau khi có dữ liệu, mới gọi hiển thị modal
          this.modal.create({
            nzTitle: 'Chi tiết Subscriber',
            nzContent: this.modalViewSubscriber,
            nzWidth: 900,
            nzFooter: null,
            nzBodyStyle: {
              'min-height': '500px',
              'padding': '24px'
            }
          });

          // ✅ Sau khi có data → mới set biểu đồ
          this.setInteractionChartData();
          this.setProgressBarStats();

          this.isViewModalVisible = true;
        }
      },
      error: () => {
        this.message.error('Lỗi khi tải chi tiết subscriber!');
      }
    });
  }

  setInteractionChartData(): void {
    const stats = this.selectedSubscriber?.stats;
    if (!stats) return;

    const totalDelivered = stats.totalDelivered;
    const totalOpened = stats.totalOpened;
    const totalUnopened = stats.totalUnopened;
    const totalClicked = stats.totalClicked;
    const totalBounced = stats.totalBounced;
    const totalComplaint = stats.totalComplaint;
    const totalUnsubscribed = stats.totalUnsubscribed;

    const isEmpty = totalDelivered + totalOpened + totalClicked + totalBounced + totalComplaint + totalUnsubscribed === 0;

    if (isEmpty) {
      this.pieChartOptions = {
        title: {
          text: 'Không có dữ liệu',
          left: 'center',
          top: 'middle',
          textStyle: {
            color: '#999',
            fontSize: 14
          }
        },
        series: [
          {
            name: 'Tương tác',
            type: 'pie',
            radius: '60%',
            center: ['50%', '50%'],
            data: [],
            label: { show: false }
          }
        ]
      };
    } else {
      this.pieChartOptions = {
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)'
        },
        legend: { bottom: 0 },
        series: [
          {
            name: 'Tương tác',
            type: 'pie',
            radius: '60%',
            center: ['50%', '50%'],
            label: { show: true, formatter: '{b}: {c}' },
            data: [
              {
                value: totalUnopened,
                name: 'Chưa mở',
                itemStyle: { color: '#d9d9d9' }
              },
              {
                value: totalOpened,
                name: 'Đã mở',
                itemStyle: { color: '#1890ff' }
              },
              {
                value: totalClicked,
                name: 'Đã click',
                itemStyle: { color: '#52c41a' }
              },
              {
                value: totalBounced,
                name: 'Bounced',
                itemStyle: { color: '#f5222d' }
              },
              {
                value: totalComplaint,
                name: 'Spam',
                itemStyle: { color: '#722ed1' }
              },
              {
                value: totalUnsubscribed,
                name: 'Unsubscribed',
                itemStyle: { color: '#faad14' }
              }
            ]
          }
        ]
      };

    }
  }

  setProgressBarStats(): void {
    if (!this.selectedSubscriber) return;
    const s = this.selectedSubscriber.stats;
    this.progressData = [
      { label: '👁️‍🗨️ Chưa mở', value: s.unOpenRate || 0, color: '#d9d9d9' },
      { label: '📬 Open Rate', value: s.openRate || 0, color: '#1890ff' },
      { label: '🔗 Click Rate', value: s.clickRate || 0, color: '#52c41a' },
      { label: '❌ Bounce Rate', value: s.bounceRate || 0, color: '#f5222d' },
      { label: '🚫 Unsubscribe Rate', value: s.unsubscribeRate || 0, color: '#faad14' },
      { label: '🛑 Complaint Rate', value: s.complaintRate || 0, color: '#722ed1' }
    ];
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'SENT': return 'send';
      case 'DELIVERED': return 'check-circle';
      case 'OPENED': return 'eye';
      case 'CLICKED': return 'link';
      case 'BOUNCED': return 'close-circle';
      case 'UNSUBSCRIBED': return 'stop';
      case 'COMPLAINT': return 'warning';
      default: return 'question-circle';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'SENT': return 'blue';
      case 'DELIVERED': return 'green';
      case 'OPENED': return 'geekblue';
      case 'CLICKED': return 'gold';
      case 'BOUNCED': return 'red';
      case 'UNSUBSCRIBED': return 'volcano';
      case 'COMPLAINT': return 'orange';
      default: return 'default';
    }
  }

  getSubscriberStatusColor(status: string): string {
    switch (status) {
      case 'ACTIVE':
        return 'green';
      case 'INACTIVE':
        return 'default';
      case 'UNSUBSCRIBED':
        return 'orange';
      case 'BOUNCED':
        return 'red';
      case 'COMPLAINED':
        return 'volcano';
      default:
        return 'default';
    }
  }


  getCampaignStatusColor(status: string): string {
    switch (status) {
      case 'DRAFT': return 'default';
      case 'SCHEDULED': return 'blue';
      case 'SENT': return 'green';
      case 'CANCELLED': return 'volcano';
      default: return 'default';
    }
  }


}
