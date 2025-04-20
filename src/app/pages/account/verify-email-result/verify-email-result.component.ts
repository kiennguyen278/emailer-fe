import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-verify-email-result',
  templateUrl: './verify-email-result.component.html',
  styleUrls: ['./verify-email-result.component.less']
})
export class VerifyEmailResultComponent implements OnInit {
  status: string | null = null;
  message: string = '';
  email: string = '';
  loading: boolean = false;
  resent: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.status = this.route.snapshot.queryParamMap.get('status');
    this.email = this.route.snapshot.queryParamMap.get('email') || '';

    switch (this.status) {
      case 'success':
        this.message = '✅ Email đã được xác minh thành công. Bạn có thể đăng nhập.';
        break;
      case 'expired':
        this.message = '⏰ Link xác nhận đã hết hạn. Bạn có thể yêu cầu gửi lại email xác minh.';
        break;
      case 'failed':
      default:
        this.message = '❌ Xác minh email thất bại. Vui lòng kiểm tra lại liên kết.';
        break;
    }
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  resendVerification(): void {
    if (!this.email) return;
    this.loading = true;
    this.http.post('/api/auth/resend-verification', { email: this.email }).subscribe({
      next: () => {
        this.resent = true;
        this.loading = false;
        this.message = '✅ Đã gửi lại email xác minh.';
      },
      error: () => {
        this.loading = false;
        this.message = '❌ Không thể gửi lại email. Vui lòng thử lại sau.';
      }
    });
  }
}
