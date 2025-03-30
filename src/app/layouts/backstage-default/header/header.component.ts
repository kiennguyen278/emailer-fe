import { Component, OnInit, Input } from '@angular/core';
import { PlatformCoreService } from 'src/app/services/platform/platform-core.service';
import { Router } from '@angular/router';
import {TokenStorageService} from "@core/services/token-storage.service";
import {NotificationService} from "@core/services/notification.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() isCollapsed: boolean;

  constructor(
    private router: Router,
    private tokenStorage: TokenStorageService,
    private notification: NotificationService,
  ) { }

  ngOnInit() {
  }

  signOut(){
    this.tokenStorage.signOut();
    this.router.navigate(['/auth/login']);
    this.notification.open({
      type: 'success',
      content: 'Bạn đã đăng xuất!'
    });
  }
}
