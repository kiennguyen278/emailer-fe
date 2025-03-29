import { Component, OnInit } from '@angular/core';
import { BaseDestroyComponent } from '@core/components';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { changeCollapsed } from '../../state/sidebar/actions';
import { MENUITEMS } from '@layout/content-layout/sidebar-menu';
import { NzModalService } from 'ng-zorro-antd/modal';
import { selectChangeCollapsed } from '../../state/sidebar/selectors';
import { takeUntil } from 'rxjs/operators';
import { TokenStorageService } from '@modules/auth/service/token-storage.service';
import { NotificationService } from '@core/services/notification.service';
import { ItemUser } from '@modules/user-role/user-manager/models';

@Component({
  selector: 'app-content-layout',
  templateUrl: './content-layout.component.html',
  styleUrls: ['./content-layout.component.scss']
})
export class ContentLayoutComponent extends BaseDestroyComponent implements OnInit{


  menuItems = MENUITEMS;

  isCollapsed = false;
  visible = false;
  user: ItemUser;

  constructor(
    private router: Router,
    private store: Store,
    private modal: NzModalService,
    private tokenStorage: TokenStorageService,
    private notification: NotificationService
  ) {
    super();
  }

  ngOnInit() {
    this.store.select(selectChangeCollapsed)
      .pipe(takeUntil(this.destroy$))
      .subscribe((isCollapsed) => {
        this.isCollapsed = isCollapsed;
      })

    this.user = this.tokenStorage.getUser();

  }


  changeCollapsed(e: any) {
    this.store.dispatch(changeCollapsed({collapsed: e}));
  }

  changeVisiblePopover() {
    this.visible = !this.visible;
  }

  signOut(){
    this.tokenStorage.signOut();
    this.router.navigate(['/auth/login']);
    this.notification.open({
      type: 'success',
      content: 'Bạn đã đăng xuất!'
    });
  }


  openDialogUserInfo() {
    console.log('openDialogUserInfo')
  }

  openDialogChangePassword() {
    console.log('openDialogChangePassword')
  }

}
