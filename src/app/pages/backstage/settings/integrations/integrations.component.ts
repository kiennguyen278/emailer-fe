import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {IntegrationSettingDTO} from "../data/setting.model";
import {IntegrationService} from "../data/integration.service";

@Component({
  selector: 'app-integrations',
  templateUrl: './integrations.component.html',
  styleUrls: ['./integrations.component.less'],
  providers: [IntegrationService]
})
export class IntegrationsComponent implements OnInit {
  list: IntegrationSettingDTO[] = [];
  loading = false;

  isModalOpen = false;
  isEditMode = false;
  form!: FormGroup;
  editingId?: number;

  constructor(
    private integrationService: IntegrationService,
    private modal: NzModalService,
    private message: NzMessageService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadList();
  }

  loadList() {
    this.loading = true;
    this.integrationService.getAll().subscribe({
      next: (res) => {
        if (res.success) {
          this.list = res.data; // ✅ Lấy đúng `data`
        } else {
          this.message.error(res.message || 'Lấy danh sách thất bại!');
        }
        this.loading = false;
      },
      error: () => {
        this.message.error('Failed to load integrations');
        this.loading = false;
      }
    });
  }

  openCreate() {
    this.isEditMode = false;
    this.isModalOpen = true;
    this.editingId = undefined;
    this.form = this.fb.group({
      systemName: ['', Validators.required],
      endpointUrl: ['', Validators.required],
      username: [''],
      password: [''],
      apiKey: [''],
      tagId: [null, [this.optionalPositiveValidator()]],
      sourceType: [{ value: 'KNACK', disabled: true }, Validators.required],
      status: ['ACTIVE', Validators.required]
    });
  }

  openEdit(item: IntegrationSettingDTO) {
    this.isEditMode = true;
    this.isModalOpen = true;
    this.editingId = item.id;
    this.form = this.fb.group({
      systemName: [item.systemName, Validators.required],
      endpointUrl: [item.endpointUrl, Validators.required],
      username: [item.username],
      password: [''], // Nếu không sửa thì để trống
      apiKey: [item.apiKey],
      tagId: [null, [this.optionalPositiveValidator()]],
      sourceType: [item.sourceType, Validators.required],
      status: [item.status, Validators.required]
    });
  }

  submitForm(): void {
    if (this.form.invalid) return;

    const body = this.form.value;
    const request$ = this.editingId
      ? this.integrationService.update(this.editingId, body)
      : this.integrationService.create(body);

    request$.subscribe({
      next: (res) => {
        if (res.success) {
          this.message.success(res.message || 'Thành công');
          this.isModalOpen = false;
          this.loadList();
        } else {
          this.message.error(res.message || 'Thao tác thất bại!');
        }
      },
      error: () => this.message.error('Không thể thực hiện thao tác')
    });
  }


  confirmDelete(id: number): void {
    this.modal.confirm({
      nzTitle: 'Xác nhận xoá?',
      nzOnOk: () =>
        this.integrationService.delete(id).subscribe({
          next: (res) => {
            if (res.success) {
              this.message.success(res.message || 'Xoá thành công');
              this.loadList();
            } else {
              this.message.error(res.message || 'Không xoá được!');
            }
          },
          error: () => this.message.error('Lỗi xoá!')
        })
    });
  }


  optionalPositiveValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value === null || value === undefined || value === '') {
        return null; // không nhập gì thì hợp lệ
      }
      return value > 0 ? null : { positive: true }; // nếu nhập thì phải > 0
    };
  }


  testConnection() {
    const value = this.form.getRawValue();
    if (!value.endpointUrl || !value.systemName) {
      this.message.warning('Vui lòng nhập Endpoint và System Name trước');
      return;
    }

    // Gọi API test (tuỳ backend bạn có không)
    this.message.info('Đang kiểm tra kết nối...');

    // Ví dụ bạn tự tạo API: POST /api/integrations/test
    this.integrationService.testConnection(value).subscribe({
      next: () => this.message.success('Kết nối thành công!'),
      error: () => this.message.error('Kết nối thất bại!')
    });
  }


  pullData(): void {
    if (!this.editingId) return;
    this.integrationService.pull(this.editingId).subscribe({
      next: (res) => {
        if (res.success) {
          this.message.success(res.message || 'Pull thành công!');
          this.loadList();
        } else {
          this.message.error(res.message || 'Pull thất bại!');
        }
      },
      error: () => this.message.error('Lỗi khi pull dữ liệu!')
    });
  }


}
