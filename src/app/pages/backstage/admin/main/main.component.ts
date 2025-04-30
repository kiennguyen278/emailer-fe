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

  smtpForm!: FormGroup;
  lastTestResult: string | null = null;
  lastTestedAt: string | null = null;

  isProcessing = false;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.initForm();       // ⚠️ Chỉ gọi 1 lần khi khởi tạo
    this.loadSettings();   // Sau đó patchValue()

    this.initSmtpForm();
    this.loadSmtpSetting();

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
        this.message.success(' Đã cập nhật cài đặt hệ thống!');
        this.loading = false;
      },
      error: () => {
        this.message.error('Lỗi khi cập nhật cài đặt!');
        this.loading = false;
      }
    });
  }

  onTabChange(index: number): void {
    this.selectedTabIndex = index;
  }

  initSmtpForm() {
    this.smtpForm = this.fb.group({
      provider: ['office365', Validators.required],
      smtpServer: ['smtp.office365.com', Validators.required],
      smtpPort: [587, Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.smtpForm.get('provider')?.valueChanges.subscribe((provider) => {
      if (provider.toLowerCase() === 'office365') {
        // Office365 chỉ cho phép port 587 và host cố định
        this.smtpForm.patchValue({
          smtpPort: 587,
          smtpServer: 'smtp.office365.com'
        });
      } else if (provider.toLowerCase() === 'ses') {
        // SES có thể chọn port 587 hoặc 465, nhưng không tự set host
        this.smtpForm.patchValue({
          smtpPort: 587,
          smtpServer: ''
        });
      }

      // Reset port nếu không hợp lệ (tránh lưu port 465 cho office365)
      const port = this.smtpForm.get('smtpPort')?.value;
      if (provider.toLowerCase() === 'office365' && port !== 587) {
        this.smtpForm.patchValue({ smtpPort: 587 });
      }
    });

  }
  loadSmtpSetting(): void {
    this.adminService.getSystemSMTP().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.smtpForm.patchValue({
            ...res.data,
            provider: res.data.provider?.toLowerCase() || null
          });


          // Gán test result ra biến hiển thị
          if (res.data.lastTestResult) {
            this.lastTestResult = res.data.lastTestResult;
          }
          if (res.data.lastTestedAt) {
            this.lastTestedAt = res.data.lastTestedAt;
          }

        } else {
          console.warn('Không tìm thấy cấu hình SMTP');
        }
      },
      error: (err) => {
        console.error('Lỗi khi load SMTP:', err);
      }
    });
  }
  onTestSmtp(): void {
    if (this.smtpForm.invalid) {
      this.message.error('Vui lòng điền đầy đủ và hợp lệ tất cả các trường bắt buộc!');
      this.smtpForm.markAllAsTouched(); // ⚠️ Đánh dấu toàn bộ control để hiển thị lỗi
      return;
    }

    const payload = this.smtpForm.value;
    this.isProcessing = true;
    this.adminService.testSmtpConnection(payload).subscribe({
      next: (result) => {
        if (result.success) {
          this.message.success('✅ Kết nối SMTP thành công.');
        } else {
          this.message.error('Kết nối thất bại. Vui lòng kiểm tra lại cấu hình.');
        }
      },
      error: (err) => {
        this.message.error('Kết nối thất bại. Vui lòng kiểm tra lại cấu hình.');
      },
      complete: () => {
        this.isProcessing = false;
      }
    });

  }

  saveSmtpSetting() {
    if (this.smtpForm.invalid) {
      this.message.error('Vui lòng điền đầy đủ và hợp lệ tất cả các trường bắt buộc!');
      this.smtpForm.markAllAsTouched(); // ⚠️ Đánh dấu toàn bộ control để hiển thị lỗi
      return;
    }
    this.adminService.saveSystemSmtpSetting(this.smtpForm.value).subscribe({
      next: () => this.message.success('✅ Cấu hình SMTP đã được lưu!'),
      error: err => this.message.error( err?.error?.message || 'Lỗi khi lưu SMTP')
    });
  }
}
