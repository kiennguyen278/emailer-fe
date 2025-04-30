import {Component, OnInit} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzMessageService} from 'ng-zorro-antd/message';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {IntegrationService} from "../data/integration.service";
import {IntegrationSettingDTO} from "../data/setting.model";

@Component({
  selector: 'app-integrations',
  templateUrl: './integrations.component.html',
  styleUrls: ['./integrations.component.less'],
  providers: [IntegrationService]
})
export class IntegrationsComponent implements OnInit {

  list: IntegrationSettingDTO[] = [];

  knackForm!: FormGroup;
  knackIntegrationId: number | null = null;
  isKnackEnabled = false;

  constructor(
    private integrationService: IntegrationService,
    private modal: NzModalService,
    private message: NzMessageService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadList();

    // knackForm
    this.initKnackForm();
  }

  loadList(): void {
    this.integrationService.getAll().subscribe({
      next: (res) => {
        if (res.success) {
          this.list = res.data || [];
        }
      },
      error: () => this.message.error('Không thể load danh sách integration!')
    });
  }

  initKnackForm(): void {
    // knackForm
    this.knackForm = this.fb.group({
      endpointUrl: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      tagId: [null, Validators.required],
      status: ['INACTIVE']
    });


    this.knackIntegrationId = null;
    this.knackForm.reset(); // Hoặc giữ giá trị rỗng
    this.knackForm.disable(); // ✅ Tắt form ban đầu
    this.isKnackEnabled = false; // ✅ Switch OFF

    // load and update from database
    this.loadKnackIntegration();
  }

// ✅ Load dữ liệu KNACK
  loadKnackIntegration(): void {
    const knack = this.list.find(x => x.sourceType === 'KNACK');
    if (knack && knack.id) {
      this.isKnackEnabled = knack.status === 'ACTIVE';
      this.knackIntegrationId = knack.id;
      this.knackForm.patchValue({
        endpointUrl: knack.endpointUrl,
        username: knack.username,
        password: knack.password,
        tagId: knack.tagId
      });
    }
  }

  // ✅ Save cấu hình KNACK
  saveKnackIntegration(): void {
    if (this.knackForm.invalid) {
      this.knackForm.markAllAsTouched(); // ✅ hiện lỗi ngay
      this.message.warning('Vui lòng nhập đầy đủ thông tin cấu hình!');
      return;
    }

    const body = {
      ...this.knackForm.value,
      sourceType: 'KNACK',
      systemName: 'Knack CRM'
    };

    const obs$ = this.knackIntegrationId
      ? this.integrationService.update(this.knackIntegrationId, body)
      : this.integrationService.create(body);

    obs$.subscribe({
      next: (res) => {
        if (res.success) {
          this.message.success(res.message || 'Đã lưu cấu hình KNACK');
          this.loadKnackIntegration(); // reload lại form
        }
      },
      error: () => this.message.error('Lỗi khi lưu cấu hình KNACK!')
    });
  }

  toggleKnackStatus(active: boolean): void {
    this.isKnackEnabled = active;
    const status = active ? 'ACTIVE' : 'INACTIVE';

    // Nếu chưa lưu integration -> chỉ enable/disable form
    if (!this.knackIntegrationId) {
      this.knackForm.patchValue({ status });
      status === 'ACTIVE' ? this.knackForm.enable() : this.knackForm.disable();
      return;
    }

    const body = {
      ...this.knackForm.getRawValue(),
      status,
      sourceType: 'KNACK',
      systemName: 'Knack CRM'
    };

    this.integrationService.update(this.knackIntegrationId, body).subscribe({
      next: (res) => {
        if (res.success) {
          this.knackForm.patchValue({ status });
          status === 'ACTIVE' ? this.knackForm.enable() : this.knackForm.disable();
          this.message.success(`Đã ${status === 'ACTIVE' ? 'bật' : 'tắt'} KNACK`);
        }
      },
      error: () => this.message.error('Lỗi khi cập nhật trạng thái!')
    });
  }


// ✅ Pull dữ liệu KNACK
  pullKnackData(): void {
    if (!this.knackIntegrationId) return;
    this.integrationService.pull(this.knackIntegrationId).subscribe({
      next: (res) => {
        if (res.success) this.message.success(res.message || 'Pull từ KNACK thành công!');
      },
      error: () => this.message.error('Lỗi khi pull từ KNACK!')
    });
  }

  pullAllKnackData(): void {
    if (!this.knackIntegrationId) return;
    this.integrationService.pullAll(this.knackIntegrationId).subscribe({
      next: (res) => {
        if (res.success) this.message.success(res.message || 'Pull từ KNACK thành công!');
      },
      error: () => this.message.error('Lỗi khi pull từ KNACK!')
    });
  }

// ✅ Test kết nối KNACK
  testKnackConnection(): void {
    if (this.knackForm.invalid) {
      this.knackForm.markAllAsTouched();
      this.message.warning('Vui lòng nhập đầy đủ thông tin để kiểm tra kết nối!');
      return;
    }

    const body = {
      ...this.knackForm.value,
      sourceType: 'KNACK',
      systemName: 'Knack CRM'
    };

    this.integrationService.testConnection(body).subscribe({
      next: (res) => {
        if (res.success) this.message.success(res.message);
      },
      error: () => this.message.error("Kết nối KNACK không thành công!")
    });
    this.message.info('✅ Kết nối KNACK: OK (demo)');
  }

  canPullKnack(): boolean {
    return this.knackForm.value.status === 'ACTIVE' && this.knackIntegrationId !== null;
  }

}
