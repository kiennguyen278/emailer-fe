import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import {SettingsService} from "../data/settings.service";
import { BusinessSetting, SmtpSetting, PasswordChange } from '../data/setting.model';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.less']
})
export class MainComponent implements OnInit {

  // Tab
  activeTabIndex = 0;

  // Business Info
  businessForm!: FormGroup;
  emailVerificationStatus = { isVerified: false };

  // SMTP
  smtpForm!: FormGroup;
  useCustomSmtp = false;

  // Password
  passwordForm!: FormGroup;

  constructor(private fb: FormBuilder, private message: NzMessageService, private settingsService: SettingsService) {}

  ngOnInit(): void {
    this.activeTabIndex = 0; // Default: Business Info

    this.initBusinessForm();
    this.initSmtpForm();
    this.initPasswordForm();

    this.loadBusinessInfo();
    this.loadSmtpSetting();
  }

  // TAB EVENT
  onTabChange(index: number): void {
    this.activeTabIndex = index;
    // Nếu cần xử lý khi chuyển tab, xử lý tại đây
  }

  // -------------------- BUSINESS INFO --------------------
  initBusinessForm() {
    this.businessForm = this.fb.group({
      businessName: ['', Validators.required],
      businessEmail: ['', [Validators.required, Validators.email]]
    });
  }

  loadBusinessInfo() {
    this.settingsService.getBusinessInfo().subscribe({
      next: (data: BusinessSetting) => {
        this.businessForm.patchValue(data);
        this.emailVerificationStatus.isVerified = data.isVerified ?? false;
      }
    });
  }

  saveBusinessInfo() {
    if (this.businessForm.invalid) return;
    this.settingsService.updateBusinessInfo(this.businessForm.value).subscribe({
      next: () => this.message.success('✅ Thông tin doanh nghiệp đã được lưu!'),
      error: err => this.message.error('❌ ' + err?.error?.message || 'Lỗi khi lưu thông tin')
    });
  }

  // -------------------- SMTP --------------------
  initSmtpForm() {
    this.smtpForm = this.fb.group({
      provider: ['', Validators.required],
      smtpServer: ['', Validators.required],
      smtpPort: [587, [Validators.required, Validators.min(1)]],
      username: ['', Validators.required],
      password: ['', Validators.required],
      type: ['CUSTOM']
    });
  }

  loadSmtpSetting() {
    this.settingsService.getSmtpSetting().subscribe({
      next: (smtp: SmtpSetting) => {
        if (smtp) {
          this.useCustomSmtp = true;
          this.smtpForm.patchValue(smtp);
        }
      }
    });
  }

  onToggleCustomSmtp(useCustom: boolean) {
    this.useCustomSmtp = useCustom;
  }

  saveSmtpSetting() {
    if (!this.useCustomSmtp || this.smtpForm.invalid) return;
    this.settingsService.saveSmtpSetting(this.smtpForm.value).subscribe({
      next: () => this.message.success('✅ Cấu hình SMTP đã được lưu!'),
      error: err => this.message.error('❌ ' + err?.error?.message || 'Lỗi khi lưu SMTP')
    });
  }

  // -------------------- PASSWORD --------------------
  initPasswordForm() {
    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  changePassword() {
    if (this.passwordForm.invalid) return;
    const { newPassword, confirmPassword } = this.passwordForm.value;
    if (newPassword !== confirmPassword) {
      this.message.error('❌ Mật khẩu nhập lại không khớp!');
      return;
    }
    this.settingsService.changePassword(this.passwordForm.value).subscribe({
      next: () => this.message.success('✅ Mật khẩu đã được đổi!'),
      error: err => this.message.error('❌ ' + err?.error?.message || 'Đổi mật khẩu thất bại')
    });
  }

}
