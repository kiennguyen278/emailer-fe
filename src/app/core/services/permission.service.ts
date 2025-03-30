
import { Injectable } from '@angular/core';
import { TokenStorageService } from '@modules/auth/service/token-storage.service';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { isEmpty } from 'lodash';
import { NotificationService } from '@core/services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionService implements CanActivate{


  constructor(
    private tokenStorageService: TokenStorageService,
    private notification: NotificationService,
    private router: Router,
  ) {}


  hasRole(roleCode: string[]){
    const user = this.tokenStorageService.getUser();

    return user.roles?.some((item) => roleCode.includes(item)) || false

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    const user = this.tokenStorageService.getUser();
    const routerData = route.data;
    const permissionDenied = routerData.permissions.denied;
    const permissionAllow = routerData.permissions.allow;

    let hasPermision = true;

    if (!isEmpty(permissionDenied)){
      hasPermision = !user.roles?.some((item) => permissionDenied.includes(item));
    }
    if (!isEmpty(permissionAllow)){
      hasPermision = user.roles?.some((item) => permissionAllow.includes(item)) || false;
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
