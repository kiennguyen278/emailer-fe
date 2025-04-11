
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { isEmpty } from 'lodash';
import { NotificationService } from '@core/services/notification.service';
import {TokenStorageService} from "@core/services/token-storage.service";

@Injectable({
  providedIn: 'root'
})
export class PermissionService implements CanActivate{


  constructor(
    private tokenStorageService: TokenStorageService,
    private notification: NotificationService,
    private router: Router,
  ) {}


  // hasRole(roleCode: string[]){
  //   const user = this.tokenStorageService.getUser();
  //
  //   return user.roles?.some((item) => roleCode.includes(item)) || false
  //
  // }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    const user = this.tokenStorageService.getUser();
    const routerData = route.data;
    const permissionAllow = routerData.permissions.allow;


    let hasPermision = true;

    // if (!isEmpty(permissionDenied)){
    //   hasPermision = !user.roles?.some((item) => permissionDenied.includes(item));
    // }


    if (!isEmpty(permissionAllow)){
      // hasPermision = user.roles?.some((item) => permissionAllow.includes(item)) || false;
      hasPermision = permissionAllow.includes(user.role) || false; // vì user Role ở UserInfo chỉ có 2 role là USER hoặc ADMIN chứ ko phải trả về 1 list role, nên chỉ cần check permissionAllow.includes(user.role) hay ko là đc
    }

    if (!hasPermision){
      this.notification.open({
        type: 'warning',
        content: 'Bạn không có quyền truy cập đường dẫn'
      });
      this.router.navigate(['/'])
    }

    return hasPermision;
  }


}
