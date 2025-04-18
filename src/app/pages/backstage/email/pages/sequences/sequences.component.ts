import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {SequenceDTO, SwitchStatusSequenceRequest} from "../../models";
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {Observable} from "rxjs";
import {
  selectDataGetSequenceList,
  selectErrorGetSequenceList,
  selectLoadingGetSequenceList
} from "../../state/selectors";
import {Store} from "@ngrx/store";
import {NotificationService} from "@core/services/notification.service";
import {EmailService} from "../../state/service";
import {ColumnConfig} from "@core/models";
import {OptionScheduledStatus} from "@core/options";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {getListSequence} from "../../state/actions";
import {CampaignDetailComponent} from "../campaigns/campaign-detail/campaign-detail.component";
import { DATE_TIME_FORMAT } from '@core/constants';
import {SequenceFormComponent} from "./sequence-form/sequence-form.component";


@UntilDestroy()
@Component({
  selector: 'app-sequences',
  templateUrl: './sequences.component.html'
})
export class SequencesComponent implements OnInit, OnDestroy {
  items: SequenceDTO[] = [];

  modalRef: NzModalRef;

  isLoading$: Observable<boolean> = this.store.select(selectLoadingGetSequenceList);

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
      header: 'Tên email sequence',
      tdClass: 'text-center',
      nzWidth: '100px',
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
      key: 'createdAt',
      header: 'Ngày tạo',
      nzWidth: '100px',
      tdClass: 'text-center',
      pipe: 'template',
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

    this.store.select(selectDataGetSequenceList)
      .pipe(untilDestroyed(this))
      .subscribe((items: SequenceDTO[]) => {
        this.items = items.map(item => ({...item, activeStatus: item.status === 'ACTIVE'}));
        this.cdr.detectChanges();
      });

    this.store.select(selectErrorGetSequenceList)
      .pipe(untilDestroyed(this))
      .subscribe((error) => {
        if (error){
          this.notification.open({
            type: 'error',
            content: error || 'Không thể tải danh sách email sequence'
          });
        }
      });
  }

  loadItems(): void {
    this.store.dispatch(getListSequence());
  }

  openModal(item?: SequenceDTO) {

    this.modalRef = this.modal.create({
      nzTitle: item?.id ? `Cập nhật chuỗi email sequence  "${item.name}"` : 'Thêm mới sequence',
      nzContent: SequenceFormComponent,
      nzData: {
        sequence: item || null
      },
      nzFooter: null,
      nzWidth: '1400px',
      nzMaskClosable: false
    });

    this.modalRef.afterClose.subscribe(isReload => {
        this.loadItems();
    });
  }

  showCreateModal() {
    this.openModal();
  }

  showEditModal(item: SequenceDTO) {
    this.openModal(item);
  }

  showViewModal(item: SequenceDTO) {

    console.log('showViewModal SequenceDTO');

    return;

    this.modal.create({
      nzTitle: 'Xem chi tiết chuỗi email sequence',
      nzContent: CampaignDetailComponent,
      nzData: {
        emailCampaign: item
      },
      nzFooter: null,
      nzWidth: 1200,
      nzMaskClosable: false
    });
  }


  confirmDelete(item: SequenceDTO) {
    this.modal.confirm({
      nzTitle: `Bạn có chắc muốn xoá chuỗi email sequence "${item.name}"?`,
      nzOkText: 'Xoá',
      nzOkDanger: true,
      nzOnOk: () => this.deleteSequence(item.id)
    });
  }

  deleteSequence(id: number) {
    this.emailService.deleteSequence(id).subscribe({
      next: () => {
        this.notification.open({
          type: 'success',
          content: 'Đã xoá email sequence'
        });
        this.loadItems();
      },
      error: () => {
        this.notification.open({
          type: 'error',
          content: 'Xoá email sequence thất bại'
        });
      }
    });
  }



  onSwitchStatus(item: SequenceDTO){
    const request: SwitchStatusSequenceRequest = {
      id: item.id!,
      status: !item.activeStatus,
    }
    this.emailService.switchStatusSequence(request)
      .pipe()
      .subscribe(res => {
        this.loadItems();
        this.notification.open({
          type: 'success',
          content: res?.message || 'Trạng thái đã được cập nhật'
        });
      })
  }

  confirmSwitchStatus(item: any){
    this.modal.confirm({
      nzTitle: `Bạn có muốn thay đổi trạng thái của sequence "${item.name}"?`,
      nzOkText: 'OK',
      nzOnOk: () => this.onSwitchStatus(item)
    });
  }


  ngOnDestroy() {
    if (this.modalRef){
      this.modalRef.destroy();
    }
  }
}
