import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {SequenceDTO} from "../../models";
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
import {getListEmailCampaign, getListSequence} from "../../state/actions";
import {CampaignFormComponent} from "../campaigns/campaign-form/campaign-form.component";
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
      header: 'Tên Sequence',
      nzWidth: '200px',
    },
    {
      key: 'description',
      header: 'Mô tả',
      nzWidth: '200px',
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

    this.store.select(selectDataGetSequenceList)
      .pipe(untilDestroyed(this))
      .subscribe((items) => {
        this.items = items;
        this.cdr.detectChanges();
      });

    this.store.select(selectErrorGetSequenceList)
      .pipe(untilDestroyed(this))
      .subscribe((error) => {
        if (error){
          this.notification.open({
            type: 'error',
            content: error || 'Không thể tải danh sách sequence'
          });
        }
      });
  }

  loadItems(): void {
    this.store.dispatch(getListSequence());
  }

  openModal(item?: SequenceDTO) {

    this.modalRef = this.modal.create({
      nzTitle: item?.id ? `Cập nhật sequence "${item.name}"` : 'Thêm mới sequence',
      nzContent: SequenceFormComponent,
      nzData: {
        sequence: item || null
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

  showEditModal(item: SequenceDTO) {
    this.openModal(item);
  }

  showViewModal(item: SequenceDTO) {

    console.log('showViewModal SequenceDTO');

    return;

    this.modal.create({
      nzTitle: 'Xem chi tiết sequence',
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
      nzTitle: `Bạn có chắc muốn xoá sequence "${item.name}"?`,
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
          content: 'Đã xoá sequence'
        });
        this.loadItems();
      },
      error: () => {
        this.notification.open({
          type: 'error',
          content: 'Xoá sequence thất bại'
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
