import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import {NzMessageService} from 'ng-zorro-antd/message';
import { SubscribersService } from '../../state/service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ValidatorUtil } from '@core/utils/validator.util';
import { FormUtil } from '@core/utils/form.util';
import { SaveTagRequest, TagDTO } from '@modules/subscribers/models';
import { ColumnConfig } from '@core/models';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss']
})
export class TagComponent implements OnInit {

  @ViewChild('modalEditTag') modalEditTag!: TemplateRef<any>;

  tags: TagDTO[] = [];
  isLoading = false;
  isLoadingSave = false;

  tagForm: FormGroup;
  modalRef: NzModalRef;

  constructor(
    private subscribersService: SubscribersService,
    private modal: NzModalService,
    private message: NzMessageService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) {
    this.buildForm();
  }

  columns: ColumnConfig[] = [
    {
      key: 'id',
      header: 'ID',
      nzWidth: '100px',
      tdClass: 'text-center',
    },
    {
      key: 'name',
      header: 'Tên Tag',
      nzWidth: '200px',
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
    this.loadTags();
  }

  loadTags(): void {
    this.isLoading = true;
    this.subscribersService.getAllTag().subscribe({
      next: (res) => {
        this.tags = res;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.message.error('Không thể tải danh sách tag');
        this.isLoading = false;
      }
    });
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
          this.message.success(formVal?.id ? 'Cập nhật thành công' : 'Tạo mới thành công');
          this.modalRef.close();
          this.loadTags();
          this.isLoadingSave = false;
          this.tagForm.reset();
        },
        error: () => {
          this.message.error('Thao tác thất bại');
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
      nzTitle: 'Bạn có chắc muốn xoá tag này?',
      nzContent: `Tag: ${tag.name}`,
      nzOkText: 'Xoá',
      nzOkDanger: true,
      nzOnOk: () => this.deleteTag(tag.id)
    });
  }

  deleteTag(id: number): void {
    this.subscribersService.delete(id).subscribe({
      next: () => {
        this.message.success('Đã xoá tag');
        this.loadTags();
      },
      error: () => this.message.error('Xoá tag thất bại')
    });
  }


  buildForm(){
    this.tagForm = this.fb.group({
      name: [null, [ValidatorUtil.required('Tên tag không được để trống!')]],
      id: [null],
    })
  }
}
