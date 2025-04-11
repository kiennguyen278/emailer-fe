import {Directive, ElementRef, Input, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import { LIST_PERMISSION_BY_GROUP } from '@core/constants/local-storage.constants.key';
import {UserInfo} from "@core/models/auth.models";
import {TokenStorageService} from "@core/services/token-storage.service";

@Directive({
  selector: '[hasPermission]'
})
export class HasPermissionDirective implements OnInit {
  private permissions: string[] = [];

  user: UserInfo;

  constructor(
    private element: ElementRef,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private tokenStorage: TokenStorageService,
  ) {
    this.user = this.tokenStorage.getUser();
  }

  ngOnInit() {
    // this.userService.currentUser.subscribe(user => {
    //   this.updateView();
    // });
  }

  @Input()
  set hasPermission(permissions: string[]) {
    this.permissions = permissions;
    this.updateView();
  }

  private updateView() {
    if (this.checkPermission()) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }

  private checkPermission() {
    let hasPermission = false;

    if (this.permissions){
      hasPermission = this.permissions.includes(this.user.role);
    }

    return hasPermission;
  }
}
