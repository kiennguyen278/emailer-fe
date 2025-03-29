import { Injectable } from '@angular/core';
import { ResponseModel } from '@core/models';
import { BaseCrudApiService } from '@core/services';
import { environment } from '@environment';
import {
  AddUserToRoleRequest, DeleteUserFromRoleRequest,
  GetListRoleRequest, GetListUserAddToRoleRequest,
  GetListUserInRoleRequest,
  ItemRole,
  SaveRoleItemRequest
} from '@modules/user-role/role-manager/models';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class RoleManagerServices extends BaseCrudApiService {

  getListRoles(queryParams: GetListRoleRequest): Observable<any> {

    const url = this.buildUrl('/role/get-role');
    return this.http.get<ResponseModel<any[]>>(url, {
      params: {...queryParams}
    });
  }

  saveRoleItem(bodyParams: SaveRoleItemRequest): Observable<any> {

    const apiPath = bodyParams?.id ? `/role/update-role/${bodyParams?.id}` : '/role/create-role';
    const method: string = bodyParams?.id ? 'put' : 'post';

    const url = this.buildUrl(apiPath);
    return this.http[method]<ResponseModel<any[]>>(url, bodyParams);
  }


  getDetailRoleById(roleId : number): Observable<ItemRole>{
    const url = this.buildUrl(`/role/get-detail-role/${roleId}`);
    return this.http.get<ItemRole>(url);
  }


  getListUserInRole(queryParams: GetListUserInRoleRequest): Observable<any> {

    const url = this.buildUrl('/role/get-user-by-role');
    return this.http.get<ResponseModel<any>>(url, {
      params: {...queryParams}
    });
  }

  getListUserAddToRole(queryParams: GetListUserAddToRoleRequest): Observable<any> {

    const url = this.buildUrl('/user/get-user-not-belong-role');
    return this.http.get<ResponseModel<any>>(url, {
      params: {...queryParams}
    });
  }


  saveUserAddToRole(body: AddUserToRoleRequest){
    const url = this.buildUrl('/role/grant-role');
    return this.http.put(url, body, {
      responseType: 'text'
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError({error: JSON.parse(error.error)});
      })
    );
  }

  deleteUserFromRole(body: DeleteUserFromRoleRequest){
    const url = this.buildUrl('/role/remove-user-role');
    return this.http.put(url, body, {
      responseType: 'text'
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError({error: JSON.parse(error.error)});
      })
    );
  }


}
