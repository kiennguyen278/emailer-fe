import {Directive, ElementRef, Input, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {TokenStorageService} from "@core/services/token-storage.service";

@Directive({
  selector: '[hasRole]'
})
export class HasRoleDirective {
  private role: string[] = [];


  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private tokenStorageService: TokenStorageService
  ) {
  }

  @Input()
  set hasRole(permission: string[]) {
    this.role = permission;
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

   const user = this.tokenStorageService.getUser();
   return user.roles?.some((item) => this.role.includes(item));
  }



  @Input()
  set hasRoleNot(permission: string[]) {
    this.role = permission;
    this.updateViewHasNotRole();
  }

  private updateViewHasNotRole() {
    if (!this.checkPermission()) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }








}
