import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {EmailCampaignDTO} from "../../models";
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {Observable} from "rxjs";
import {
  selectDataGetEmailCampaignList,
  selectErrorGetEmailCampaignList,
  selectLoadingGetEmailCampaignList,
} from "../../state/selectors";
import {Store} from "@ngrx/store";
import {NotificationService} from "@core/services/notification.service";
import {EmailService} from "../../state/service";
import {ColumnConfig} from "@core/models";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {getListEmailCampaign} from "../../state/actions";
import { DATE_TIME_FORMAT } from '@core/constants';
import {OptionScheduledStatus} from "@core/options";
import {CampaignFormComponent} from "./campaign-form/campaign-form.component";
import {CampaignDetailComponent} from "./campaign-detail/campaign-detail.component";


@UntilDestroy()
@Component({
  selector: 'app-campaigns',
  templateUrl: './campaigns.component.html'
})
export class CampaignsComponent implements OnInit, OnDestroy {
  items: EmailCampaignDTO[] = [];

  modalRef: NzModalRef;

  isLoading$: Observable<boolean> = this.store.select(selectLoadingGetEmailCampaignList);

  constructor(
    private store: Store,
    private modal: NzModalService,
    private cdr: ChangeDetectorRef,
    private notification: NotificationService,
    private emailService: EmailService,
  ) {}

  DATE_TIME_FORMAT = DATE_TIME_FORMAT;

  columns: ColumnConfig[] = [
    {
      key: 'name',
      header: 'Tên Campaign',
      nzWidth: '200px',
    },
    {
      key: 'description',
      header: 'Mô tả',
      nzWidth: '200px',
    },
    {
      key: 'subject',
      header: 'Subject',
      nzWidth: '200px',
    },
    {
      key: 'scheduledTime',
      header: 'Scheduled Time',
      nzWidth: '100px',
      tdClass: 'text-center',
      pipe: 'template',
    },
    {
      key: 'createdAt',
      header: 'Ngày tạo',
      nzWidth: '100px',
      tdClass: 'text-center',
      pipe: 'template',
    },
    {
      key: 'status',
      header: 'Trạng thái',
      nzWidth: '100px',
      tdClass: 'text-center',
      filter: {
        type: 'select',
        options: OptionScheduledStatus,
      }
    },
    {
      key: 'actions',
      header: 'Thao Tác',
      tdClass: 'text-center',
      pipe: 'template',
      nzWidth: '80px',
    },
  ];

  ngOnInit(): void {
    this.loadItems();

    this.store.select(selectDataGetEmailCampaignList)
      .pipe(untilDestroyed(this))
      .subscribe((items) => {
        this.items = items;
        this.cdr.detectChanges();
      });

    this.store.select(selectErrorGetEmailCampaignList)
      .pipe(untilDestroyed(this))
      .subscribe((error) => {
        if (error){
          this.notification.open({
            type: 'error',
            content: error || 'Không thể tải danh sách email campaign'
          });
        }
      });
  }

  loadItems(): void {
    this.store.dispatch(getListEmailCampaign());
  }

  openModal(item?: EmailCampaignDTO) {

    this.modalRef = this.modal.create({
      nzTitle: item?.id ? `Cập nhật email campaign "${item.name}"` : 'Thêm mới email campaign',
      nzContent: CampaignFormComponent,
      nzData: {
        emailCampaign: item || null
      },
      nzFooter: null,
      nzWidth: '1400px',
      nzMaskClosable: false
    });

    this.modalRef.afterClose.subscribe(isReload => {
      if(isReload){
        this.loadItems();
      }
    });
  }

  showCreateModal() {
    this.openModal();
  }

  showEditModal(item: EmailCampaignDTO) {
    this.openModal(item);
  }

  showViewModal(item: EmailCampaignDTO) {
    this.modal.create({
      nzTitle: 'Xem chi tiết chiến dịch',
      nzContent: CampaignDetailComponent,
      nzData: {
        emailCampaign: item
      },
      nzFooter: null,
      nzWidth: 1200,
      nzClassName: 'custom-campaign-modal',
      nzMaskClosable: false
    });
  }


  confirmDelete(item: EmailCampaignDTO) {
    this.modal.confirm({
      nzTitle: `Bạn có chắc muốn xoá email campaign "${item.name}"?`,
      nzOkText: 'Xoá',
      nzOkDanger: true,
      nzOnOk: () => this.deleteEmailTemplate(item.id)
    });
  }

  deleteEmailTemplate(id: number) {
    this.emailService.deleteMailCampaign(id).subscribe({
      next: () => {
        this.notification.open({
          type: 'success',
          content: 'Đã xoá email campaign'
        });
        this.loadItems();
      },
      error: () => {
        this.notification.open({
          type: 'error',
          content: 'Xoá email campaign thất bại'
        });
      }
    });
  }

  ngOnDestroy() {
    if (this.modalRef){
      this.modalRef.destroy();
    }
  }
}
