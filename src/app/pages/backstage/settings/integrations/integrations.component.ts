import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
    private service: IntegrationService,
    private modal: NzModalService,
    private message: NzMessageService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadList();
  }

  loadList() {
    this.loading = true;
    this.service.list().subscribe({
      next: (res) => {
        this.list = res;
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
      sourceType: ['OTHER', Validators.required],
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
      sourceType: [item.sourceType, Validators.required],
      status: [item.status, Validators.required]
    });
  }

  submitForm() {
    if (this.form.invalid) {
      this.message.error('Please fill all required fields');
      return;
    }
    const value = this.form.value;
    if (this.isEditMode && this.editingId != null) {
      this.service.update(this.editingId, value).subscribe({
        next: () => {
          this.message.success('Updated successfully');
          this.loadList();
          this.isModalOpen = false;
        }
      });
    } else {
      this.service.create(value).subscribe({
        next: () => {
          this.message.success('Created successfully');
          this.loadList();
          this.isModalOpen = false;
        }
      });
    }
  }

  confirmDelete(id: number) {
    this.modal.confirm({
      nzTitle: 'Are you sure delete this integration?',
      nzOnOk: () => this.service.delete(id).subscribe({
        next: () => {
          this.message.success('Deleted successfully');
          this.loadList();
        }
      })
    });
  }
}
