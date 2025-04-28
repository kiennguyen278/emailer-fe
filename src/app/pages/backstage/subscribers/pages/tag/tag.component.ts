import { ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import {NzMessageService} from 'ng-zorro-antd/message';
import { SubscribersService } from '../../state/service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ValidatorUtil } from '@core/utils/validator.util';
import { FormUtil } from '@core/utils/form.util';
import { Store } from '@ngrx/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';
import { NotificationService } from '@core/services/notification.service';
import {SaveTagRequest, TagDTO} from "../../models";
import {selectDataGetTagsList, selectErrorGetTagsList, selectLoadingGetTagsList} from "../../state/selectors";
import {ColumnConfig} from "@core/models/column-config.model";
import {getListTags} from "../../state/actions";

@UntilDestroy()
@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss']
})
export class TagComponent implements OnInit, OnDestroy {

  @ViewChild('modalEditTag') modalEditTag!: TemplateRef<any>;

  tags: TagDTO[] = [];
  isLoadingSave = false;

  tagForm: FormGroup;
  modalRef: NzModalRef;

  isLoading$: Observable<boolean> = this.store.select(selectLoadingGetTagsList);

  constructor(
    private store: Store,
    private subscribersService: SubscribersService,
    private modal: NzModalService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private notification: NotificationService,
  ) {
    this.buildForm();
  }

  columns: ColumnConfig[] = [
    {
      key: 'name',
      header: 'Tên Tag',
      tdClass: 'text-center',
      nzWidth: '75%',
    },
    {
      key: 'actions',
      header: 'Thao Tác',
      tdClass: 'text-center',
      pipe: 'template',
      nzWidth: '25%',
    },
  ];

  ngOnInit(): void {
    this.loadTags();

    this.store.select(selectDataGetTagsList)
      .pipe(untilDestroyed(this))
      .subscribe((items) => {
        this.tags = items;
        this.cdr.detectChanges();
      });

    this.store.select(selectErrorGetTagsList)
      .pipe(untilDestroyed(this))
      .subscribe((error) => {
        if (error){
          this.notification.open({
            type: 'error',
            content: error || 'Không thể tải danh sách tag'
          });
        }
      });
  }

  loadTags(): void {
    this.store.dispatch(getListTags());
  }

  openModal(tag?: TagDTO) {
    if (tag?.id){
      this.tagForm.patchValue(tag);
    } else {
      this.tagForm.reset();
    }
    this.modalRef = this.modal.create({
      nzTitle: tag?.id ? `Cập nhật tag "${tag.name}"` : 'Thêm mới tag',
      nzContent: this.modalEditTag,
      nzFooter: null
    });
  }

  showCreateModal(): void {
    this.openModal();
  }

  showEditModal(tag: TagDTO): void {
    this.openModal(tag);
  }


  handleOk(): void {
    FormUtil.validate(this.tagForm);

    this.isLoadingSave = true;

    const formVal: SaveTagRequest = this.tagForm.getRawValue();
    this.subscribersService.saveTag(formVal).pipe()
      .subscribe({
        next: () => {
          this.notification.open({
            type: 'success',
            content: formVal?.id ? 'Cập nhật tag thành công' : 'Thêm tag mới thành công'
          })
          this.modalRef.close();
          this.loadTags();
          this.isLoadingSave = false;
          this.tagForm.reset();
        },
        error: ({error}) => {
          this.notification.open({
            type: 'error',
            content: error?.message || 'Thao tác thất bại'
          });
          this.isLoadingSave = false;
        }
      });
  }

  handleCancel(): void {
    this.tagForm.reset();
    this.modalRef.close();
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
    this.subscribersService.delete(id).subscribe({
      next: () => {
        this.notification.open({
          type: 'success',
          content: 'Đã xoá tag'
        });

        this.loadTags();
      },
      error: ({error}) => {
      this.notification.open({
        type: 'error',
        content: error?.message || 'Xoá tag thất bại'
      });
    }
    });
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
