import {Directive, ElementRef, Input, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {PermissionItemResponse} from "@core/models/permission.model";
import { LIST_PERMISSION_BY_GROUP } from '@core/constants/local-storage.constants.key';

@Directive({
  selector: '[hasPermission]'
})
export class HasPermissionDirective implements OnInit {
  private permissions: string = '';
  private type = '';

  listGroupPermission: any[] = JSON.parse(window.localStorage.getItem(LIST_PERMISSION_BY_GROUP)!) || [];

  constructor(
    private element: ElementRef,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
  ) {
  }

  ngOnInit() {
    // this.userService.currentUser.subscribe(user => {
    //   this.updateView();
    // });
  }

  @Input()
  set hasPermission(permission: string) {
    this.permissions = permission;
    this.updateView();
  }

  @Input()
  set hasPermissionType(type: string) {
    this.type = type;
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

    if (this.type && this.permissions){

      const permissionGroupType = this.listGroupPermission[this.type];
      hasPermission = permissionGroupType?.some((item: PermissionItemResponse) => item.permissionCode == this.permissions);
    }

    // if (this.currentUser && this.currentUser.permissions) {
    //   for (const checkPermission of this.permissions) {
    //     const permissionFound = this.currentUser.permissions.find(x => x.toUpperCase() === checkPermission.toUpperCase());
    //   ...
    //   }
    // }

    return hasPermission;
  }
}
