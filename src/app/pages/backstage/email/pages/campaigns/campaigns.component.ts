import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {
  EmailCampaignDTO,
  EmailTemplateDTO,
  SwitchStatusCampaignRequest,
  SwitchStatusSequenceRequest
} from "../../models";
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
import {CampainStatusOptions, OptionScheduledStatus} from "@core/options";
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
  campainStatusOptions = CampainStatusOptions;

  columns: ColumnConfig[] = [
    {
      key: 'name',
      header: 'Tên chiến dịch',
      tdClass: 'text-center',
      nzWidth: '200px',
    },
    {
      key: 'subject',
      header: 'Tiêu đề',
      tdClass: 'text-center',
      nzWidth: '200px',
    },
    {
      key: 'scheduledTime',
      header: 'Thời gian gửi',
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
      pipe: 'template',
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
        this.items = [...items];
        this.cdr.detectChanges();
      });

    this.store.select(selectErrorGetEmailCampaignList)
      .pipe(untilDestroyed(this))
      .subscribe((error) => {
        if (error){
          this.notification.open({
            type: 'error',
            content: error || 'Không thể tải danh sách chiến dịch'
          });
        }
      });
  }

  loadItems(): void {
    this.store.dispatch(getListEmailCampaign());
  }

  openModal(item?: EmailCampaignDTO) {

    this.modalRef = this.modal.create({
      nzTitle: item?.id ? `Cập nhật chiến dịch "${item.name}"` : 'Thêm mới chiến dịch',
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
      nzTitle: 'Chi tiết chiến dịch',
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
      nzTitle: `Bạn có chắc muốn xoá chiến dịch "${item.name}"?`,
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
          content: 'Đã xoá chiến dịch email thành công'
        });
        this.loadItems();
      },
      error: ({error}) => {
        this.notification.open({
          type: 'error',
          content: error?.message || 'Xoá chiến dịch email thất bại'
        });
      }
    });
  }


  onChangeStatusCampaign(item: EmailCampaignDTO, status: 'PAUSED' | 'CANCELLED' | 'SCHEDULED'){
    const request: SwitchStatusCampaignRequest = {
      id: item.id!,
      status,
    }
    this.emailService.switchStatusCampaign(request)
      .pipe()
      .subscribe({
        next: (res) => {
          this.loadItems();
          this.notification.open({
            type: 'success',
            content: res?.message || 'Trạng thái đã được cập nhật'
          });
        },
        error: ({error}) => {
          this.notification.open({
            type: 'error',
            content: error?.message || 'Có lỗi khi thay đổi trạng thái campaign'
          });
        }
      })
  }

  confirmSwitchStatus(item: EmailCampaignDTO, status: 'PAUSED' | 'CANCELLED' | 'SCHEDULED'){

    console.log('item', status, item)
    this.modal.confirm({
      nzTitle: `Bạn có muốn thay đổi trạng thái của campaign "${item.name}"?`,
      nzOkText: 'OK',
      nzOnOk: () => this.onChangeStatusCampaign(item, status),
    });
  }

  ngOnDestroy() {
    if (this.modalRef){
      this.modalRef.destroy();
    }
  }
}
