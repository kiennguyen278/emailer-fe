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
import {EmailTemplateDTO} from "../../models";
import {
  selectDataGetEmailTemplateList,
  selectErrorGetEmailTemplateList,
  selectLoadingGetEmailTemplateList
} from "../../state/selectors";
import {getListEmailTemplate} from "../../state/actions";
import {DATE_TIME_FORMAT} from "@core/constants";
import {TemplateFormComponent} from "./template-form/template-form.component";

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
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private notification: NotificationService,
  ) {}

  DATE_TIME_FORMAT = DATE_TIME_FORMAT;

  columns: ColumnConfig[] = [
    {
      key: 'id',
      header: 'ID',
      nzWidth: '100px',
      tdClass: 'text-center',
    },
    {
      key: 'name',
      header: 'Tên Email Template',
      nzWidth: '200px',
    },
    {
      key: 'subject',
      header: 'Subject',
      nzWidth: '200px',
    },
    {
      key: 'subject',
      header: 'Subject',
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
        this.items = items;
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
      nzOnOk: () => this.deleteTag(item.id)
    });
  }

  deleteTag(id: number): void {
    // this.subscribersService.delete(id).subscribe({
    //   next: () => {
    //     this.notification.open({
    //       type: 'success',
    //       content: 'Đã xoá tag'
    //     });
    //
    //     this.loadTags();
    //   },
    //   error: () => {
    //     this.notification.open({
    //       type: 'error',
    //       content: 'Xoá tag thất bại'
    //     });
    //   }
    // });
  }

  ngOnDestroy() {
    if (this.modalRef){
      this.modalRef.destroy();
    }
  }

}
