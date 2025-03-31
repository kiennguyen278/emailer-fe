import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
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

@UntilDestroy()
@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
})
export class TemplatesComponent implements OnInit {

  items: EmailTemplateDTO[] = [];

  tagForm: FormGroup;
  modalRef: NzModalRef;

  isLoading$: Observable<boolean> = this.store.select(selectLoadingGetEmailTemplateList);

  constructor(
    private store: Store,
    private modal: NzModalService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private notification: NotificationService,
  ) {
    this.buildForm();
  }

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

  openModal(tag?: TagDTO) {

    // this.modalRef = this.modal.create({
    //   nzTitle: tag?.id ? `Cập nhật tag "${tag.name}"` : 'Thêm mới tag',
    //   nzContent: this.modalEditTag,
    //   nzFooter: null
    // });
  }

  showCreateModal(): void {
    this.openModal();
  }

  showEditModal(tag: TagDTO): void {
    this.openModal(tag);
  }

  confirmDelete(tag: TagDTO): void {
    this.modal.confirm({
      nzTitle: `Bạn có chắc muốn xoá tag "${tag.name}"?`,
      nzOkText: 'Xoá',
      nzOkDanger: true,
      nzOnOk: () => this.deleteTag(tag.id)
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

  buildForm(){
    this.tagForm = this.fb.group({
      name: [null, [ValidatorUtil.required('Tên tag không được để trống!')]],
      id: [null],
    })
  }

  ngOnDestroy() {
    if (this.modalRef){
      this.modalRef.destroy();
    }
  }

}
