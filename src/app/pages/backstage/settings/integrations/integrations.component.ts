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


  // KNACK Integration
  knackProcessing = false;
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

    this.initKnackForm();  // ✅ luôn khởi tạo form trống ban đầu
    this.loadList();       // ✅ sau đó load dữ liệu để patch nếu có
  }

  loadList(): void {
    this.integrationService.getAll().subscribe({
      next: (res) => {
        if (res.success) {
          this.list = res.data || [];
          // ✅ Load dữ liệu KNACK
          this.loadKnackIntegration();
        }
      },
      error: () => this.message.error('Không thể load danh sách integration!')
    });
  }

  initKnackForm(): void {
    // knackForm
    this.knackForm = this.fb.group({
      endpointUrl: ['https://webmedius.knack.com/dream-team-admin-v2#business-owners-v2/viewmyleads/', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      tagId: [null, Validators.required],
      status: ['INACTIVE']
    });
    this.isKnackEnabled = false;       // ✅ switch mặc định OFF
    this.knackIntegrationId = null;    // ✅ chưa có id ban đầu
  }

// ✅ Load dữ liệu KNACK
  loadKnackIntegration(): void {
    const knack = this.findIntegration('knack');
    if (knack && knack.id) {
      this.isKnackEnabled = knack.status === 'ACTIVE';
      this.knackIntegrationId = knack.id;
      this.knackForm.patchValue({
        endpointUrl: knack.endpointUrl || 'https://webmedius.knack.com/dream-team-admin-v2#business-owners-v2/viewmyleads/',
        username: knack.username,
        password: knack.password,
        tagId: knack.tagId,
        status:knack.status
      });
    }
  }

  private findIntegration(type: string): IntegrationSettingDTO | undefined {
    return this.list.find(x => x.sourceType?.toLowerCase() === type.toLowerCase());
  }

  // ✅ Save cấu hình KNACK
  saveKnackIntegration(): void {
    if (this.knackForm.invalid) {
      this.knackForm.markAllAsTouched(); // ✅ hiện lỗi ngay
      this.message.warning('Vui lòng nhập đầy đủ thông tin cấu hình!');
      return;
    }

    const dto: IntegrationSettingDTO = {
      ...this.knackForm.getRawValue(),
      sourceType: 'KNACK',
      systemName: 'Knack CRM'
    };

    this.knackProcessing = true;

    this.integrationService.save(dto).subscribe({
      next: (res) => {
        if (res.success) {
          this.message.success(res.message || 'Đã lưu cấu hình KNACK!');
          this.knackIntegrationId = res.data?.id ?? null;
          this.knackForm.patchValue({ status: res.data?.status });
        }
      },
      error: () => {
        this.message.error('Lỗi khi lưu cấu hình KNACK!')
      },
      complete: () => {
        this.knackProcessing = false;
      }
    });

  }

  toggleKnackStatus(active: boolean): void {
    this.isKnackEnabled = active;
    const status = active ? 'ACTIVE' : 'INACTIVE';

    // Nếu chưa lưu integration → chỉ enable/disable form (không call API)
    if (!this.knackIntegrationId) {
      this.knackForm.patchValue({ status });
      status === 'ACTIVE' ? this.knackForm.enable() : this.knackForm.disable();
      return;
    }

    // Gọi API update status
    this.integrationService.updateStatus(this.knackIntegrationId, status).subscribe({
      next: (res) => {
        if (res.success) {
          this.knackForm.patchValue({ status: res.data?.status });
          status === 'ACTIVE' ? this.knackForm.enable() : this.knackForm.disable();
          this.message.success(`Đã ${status === 'ACTIVE' ? 'bật' : 'tắt'} KNACK`);
        } else {
          this.message.error(res.message || 'Cập nhật trạng thái thất bại!');
        }
      },
      error: () => this.message.error('Lỗi khi gọi API cập nhật trạng thái!')
    });
  }

// ✅ Pull dữ liệu KNACK
  pullKnackData(): void {
    if (!this.knackIntegrationId) return;
    this.knackProcessing = true;

    this.integrationService.fetchSubscribersFromKnack(this.knackIntegrationId).subscribe({
      next: (res) => {
        if (res.success) {
          const count = res.data || 0;
          this.message.success(`Đã cập nhật ${count} subscriber(s) vào hệ thống.`);
        } else {
          this.message.error(res.message || 'Pull từ KNACK thất bại!');
        }
      },
      error: () => {
        this.message.error('Lỗi khi pull từ KNACK!');
      },
      complete: () => {
        this.knackProcessing = false;
      }
    });
  }


  pullAllKnackData(): void {
    if (!this.knackIntegrationId) return;
    this.knackProcessing = true;

    this.integrationService.fetchAllSubscribersFromKnack(this.knackIntegrationId).subscribe({
      next: (res) => {
        if (res.success) {
          const count = res.data || 0;
          this.message.success(`Đã cập nhật ${count} subscriber(s) vào hệ thống.`);
        } else {
          this.message.error(res.message || 'Pull toàn bộ từ KNACK thất bại!');
        }
      },
      error: () => {
        this.message.error('Lỗi khi pull toàn bộ từ KNACK!');
      },
      complete: () => {
        this.knackProcessing = false;
      }
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

    this.knackProcessing = true;
    this.integrationService.testKnackConnection(body).subscribe({
      next: (res) => {
        this.message[res.success ? 'success' : 'error'](res.message);
      },
      error: () => {
        this.message.error('Lỗi khi kiểm tra kết nối!');
      },
      complete: () => {
          this.knackProcessing = false;
      }
    });
  }

  canPullKnack(): boolean {
    return this.knackForm.value.status === 'ACTIVE' && this.knackIntegrationId !== null && !this.knackProcessing;
  }



  // ConvertKit Integration
  isConvertkitEnabled = false;
  toggleConvertkitStatus(active: boolean): void {
    this.isConvertkitEnabled = active;
  }

}
