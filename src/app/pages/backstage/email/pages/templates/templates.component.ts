import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {TagDTO} from "../../../subscribers/models";
import {FormBuilder, FormGroup} from "@angular/forms";
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {Observable} from "rxjs";
import {Store} from "@ngrx/store";
import {NotificationService} from "@core/services/notification.service";
import {ColumnConfig} from "@core/models";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {ValidatorUtil} from "@core/utils/validator.util";
import {EmailTemplateDTO, SequenceDTO, SwitchStatusSequenceRequest} from "../../models";
import {
  selectDataGetEmailTemplateList,
  selectErrorGetEmailTemplateList,
  selectLoadingGetEmailTemplateList
} from "../../state/selectors";
import {getListEmailTemplate} from "../../state/actions";
import {DATE_TIME_FORMAT} from "@core/constants";
import {TemplateFormComponent} from "./template-form/template-form.component";
import {EmailService} from "../../state/service";

@UntilDestroy()
@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
})
export class TemplatesComponent implements OnInit, OnDestroy {

  items: EmailTemplateDTO[] = [];

  modalRef: NzModalRef;

  isLoading$: Observable<boolean> = this.store.select(selectLoadingGetEmailTemplateList);

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
      header: 'Tên email template',
      nzWidth: '200px',
    },
    {
      key: 'subject',
      header: 'Tiêu đề',
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

    this.store.select(selectDataGetEmailTemplateList)
      .pipe(untilDestroyed(this))
      .subscribe((items) => {
        this.items = items.map(item => ({...item, activeStatus: item.status === 'ACTIVE'}));
        this.cdr.detectChanges();
      });

    this.store.select(selectErrorGetEmailTemplateList)
      .pipe(untilDestroyed(this))
      .subscribe((error) => {
        if (error){
          this.notification.open({
            type: 'error',
            content: error || 'Không thể tải danh sách email template'
          });
        }
      });
  }

  loadItems(): void {
    this.store.dispatch(getListEmailTemplate());
  }

  openModal(item?: EmailTemplateDTO) {

    this.modalRef = this.modal.create({
      nzTitle: item?.id ? `Cập nhật email template "${item.name}"` : 'Thêm mới email template',
      nzContent: TemplateFormComponent,
      nzData: {
        emailTemplate: item || null
      },
      nzFooter: null,
      nzWidth: '860px',
      nzMaskClosable: false
    });

    this.modalRef.afterClose.subscribe(isReload => {
      if(isReload){
        this.loadItems();
      }
    });
  }

  showCreateModal(): void {
    this.openModal();
  }

  showEditModal(item: EmailTemplateDTO): void {
    this.openModal(item);
  }

  confirmDelete(item: EmailTemplateDTO): void {
    this.modal.confirm({
      nzTitle: `Bạn có chắc muốn xoá email template "${item.name}"?`,
      nzOkText: 'Xoá',
      nzOkDanger: true,
      nzOnOk: () => this.deleteEmailTemplate(item.id)
    });
  }

  deleteEmailTemplate(id: number) {
    this.emailService.deleteMailTemplate(id).subscribe({
      next: () => {
        this.notification.open({
          type: 'success',
          content: 'Đã xoá email template'
        });
        this.loadItems();
      },
      error: ({error}) => {
        this.notification.open({
          type: 'error',
          content: error?.message || 'Xoá email template thất bại'
        });
      }
    });
  }


  onSwitchStatus(item: EmailTemplateDTO){
    const request: SwitchStatusSequenceRequest = {
      id: item.id!,
      status: !item.activeStatus,
    }
    this.emailService.switchStatusTemplate(request)
      .pipe()
      .subscribe({
        next: (res) => {
          this.loadItems();
          this.notification.open({
            type: 'success',
            content: res?.message || 'Trạng thái template đã được cập nhật'
          });
        },
        error: ({error}) => {
          this.notification.open({
            type: 'error',
            content: error?.message || 'Có lỗi khi thay đổi trạng thái template'
          });
        }
      })
  }

  confirmSwitchStatus(item: any){
    this.modal.confirm({
      nzTitle: `Bạn có muốn thay đổi trạng thái của template "${item.name}"?`,
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
