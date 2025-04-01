import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.less']
})
export class MainComponent implements OnInit {
  businessForm!: FormGroup;
  passwordForm!: FormGroup;
  smtpForm!: FormGroup;
  useCustomSmtp = true; // hoặc false tùy API
  emailVerificationStatus = {
    isVerified: false,
    dkimStatus: 'PENDING',
    spfStatus: 'PENDING',
    dmarcStatus: 'PENDING'
  };

  constructor(private fb: FormBuilder, private message: NzMessageService) {}


  ngOnInit(): void {
    this.businessForm = this.fb.group({
      bizName: ['ACME Corp.', Validators.required],
      bizEmail: ['contact@acme.com', [Validators.required, Validators.email]]
    });

    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });

    this.smtpForm = this.fb.group({
      provider: ['Amazon SES'],
      smtpServer: ['email-smtp.us-east-1.amazonaws.com'],
      smtpPort: [587],
      username: ['AKIAXXXXXXX'],
      password: ['']
    });

    // Giả lập gọi API lấy trạng thái xác minh email
    setTimeout(() => {
      this.emailVerificationStatus = {
        isVerified: true,
        dkimStatus: 'VERIFIED',
        spfStatus: 'VERIFIED',
        dmarcStatus: 'PENDING'
      };
    }, 500);
  }

  saveBusinessInfo(): void {
    if (this.businessForm.invalid) {
      this.message.warning('Vui lòng nhập đầy đủ thông tin doanh nghiệp');
      return;
    }
    console.log('Business Info:', this.businessForm.value);
    this.message.success('Đã lưu thông tin doanh nghiệp');
  }

  changePassword(): void {
    const { newPassword, confirmPassword } = this.passwordForm.value;
    if (this.passwordForm.invalid || newPassword !== confirmPassword) {
      this.message.error('Mật khẩu không hợp lệ hoặc không khớp');
      return;
    }
    console.log('Change password:', this.passwordForm.value);
    this.message.success('Đã đổi mật khẩu thành công');
  }

  testSmtpConnection(): void {
    console.log('Test SMTP with:', this.smtpForm.value);
    this.message.info('Đang kiểm tra kết nối SMTP...');
    setTimeout(() => {
      this.message.success('Kết nối SMTP thành công!');
    }, 1000);
  }

  saveSmtpSettings(): void {
    if (this.smtpForm.invalid) {
      this.message.warning('Vui lòng nhập đầy đủ thông tin SMTP');
      return;
    }
    console.log('Save SMTP config:', this.smtpForm.value);
    this.message.success('Đã lưu cấu hình SMTP');
  }

  onToggleCustomSmtp(value: boolean): void {
    this.useCustomSmtp = value;
    console.log('useCustomSmtp:', value);
    if (value) {
      // Khi bật: gán giá trị mặc định vào form nếu muốn
      this.smtpForm.patchValue({
        provider: 'Amazon SES',
        smtpServer: 'email-smtp.us-east-1.amazonaws.com',
        smtpPort: 587,
        username: '',
        password: ''
      });
    } else {
      // Khi tắt: reset form hoặc disable form fields
      this.smtpForm.reset();
    }

    // Optional: Gọi API để lưu trạng thái ON/OFF
    // this.http.post('/api/settings/smtp-toggle', { useCustom: value }).subscribe(...)
  }

}
