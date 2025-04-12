import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import {TokenStorageService} from "@core/services/token-storage.service";
import {NotificationService} from "@core/services/notification.service";
import {UserInfo} from "@core/models/auth.models";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() isCollapsed: boolean;

  user: UserInfo;

  constructor(
    private router: Router,
    private tokenStorage: TokenStorageService,
    private notification: NotificationService,
  ) {
    this.user = this.tokenStorage.getUser();
  }

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
