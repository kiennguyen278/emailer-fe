import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-verify-email-result',
  templateUrl: './verify-email-result.component.html',
  styleUrls: ['./verify-email-result.component.less']
})
export class VerifyEmailResultComponent implements OnInit {
  status: string | null = null;
  message: string = '';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.status = this.route.snapshot.queryParamMap.get('status');

    switch (this.status) {
      case 'success':
        this.message = '✅ Email đã được xác minh thành công. Bạn có thể đăng nhập.';
        setTimeout(() => this.router.navigate(['/auth/login']), 2500);
        break;
      case 'expired':
        this.message = '⏰ Link xác nhận đã hết hạn. Hệ thống đã gửi lại email xác minh mới.';
        break;
      case 'failed':
      default:
        this.message = '❌ Xác minh email thất bại. Vui lòng kiểm tra lại liên kết.';
        break;
    }
  }
}
