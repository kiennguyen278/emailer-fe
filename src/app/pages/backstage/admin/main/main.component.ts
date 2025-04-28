import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import {AdminService} from "../data/admin.service";
import {GeneralSettings} from "../data/admin.dto";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html'
})
export class MainComponent implements OnInit {
  selectedTabIndex = 0;
  generalForm!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.initForm();       // ⚠️ Chỉ gọi 1 lần khi khởi tạo
    this.loadSettings();   // Sau đó patchValue()
  }

  initForm(): void {
    this.generalForm = this.fb.group({
      systemName: ['', Validators.required],
      systemEmail: ['', [Validators.required, Validators.email]],
      enableDefaultSmtp: [false],
      enabledSending: [false],
      timeZone: ['Asia/Ho_Chi_Minh']
    });
  }

  loadSettings(): void {
    this.loading = true;
    this.adminService.getGeneralSettings().subscribe({
      next: (res: any) => {
        const data: GeneralSettings = res.data; // ✅ bóc 'data'
        console.log('✅ Settings loaded:', data);
        this.generalForm.patchValue(data);
        this.loading = false;
      },
      error: () => {
        this.message.error('Lỗi tải cài đặt hệ thống');
        this.loading = false;
      }
    });
  }

  saveSettings(): void {
    if (this.generalForm.invalid) {
      this.generalForm.markAllAsTouched();
      this.message.warning('Vui lòng kiểm tra lại các trường bắt buộc');
      return;
    }

    const payload: GeneralSettings = this.generalForm.value;
    this.loading = true;

    this.adminService.updateGeneralSettings(payload).subscribe({
      next: () => {
        this.message.success('✅ Đã cập nhật cài đặt hệ thống!');
        this.loading = false;
      },
      error: () => {
        this.message.error('❌ Lỗi khi cập nhật cài đặt!');
        this.loading = false;
      }
    });
  }

  onTabChange(index: number): void {
    this.selectedTabIndex = index;
  }
}
