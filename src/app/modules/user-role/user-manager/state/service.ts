import { Injectable } from '@angular/core';
import { ResponseModel } from '@core/models';
import { BaseCrudApiService } from '@core/services';
import { GetListUserRequest, SaveUserRequest, UserDetailResponsed } from '../models';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class UserManagerServices extends BaseCrudApiService {

  getListUser(request: GetListUserRequest): Observable<any> {

    const url = this.buildUrl('/user/get-user')
    return this.http.post<ResponseModel<any[]>>(url, request.body, {
        params: {...request.params}
      }
    );
  }


  saveUserItem(bodyParams: SaveUserRequest): Observable<any> {

    const apiPath: string = bodyParams?.id ? `/user/update-user/${bodyParams.id}` : '/user/create-user';
    const method: 'put' | 'post' = bodyParams?.id ? 'put' : 'post'

    const url = this.buildUrl(apiPath);
    return this.http[method]<ResponseModel<any>>(url, bodyParams);
  }


  resetPasswordUser(userName: string){
    const url = this.buildUrl('/user/reset-password');
    return this.http.put(url, null, {
        params: {userName},
        responseType: 'text' // vì response của backend trả ra khi sucess chỉ là 1 text "Success", nên phải set responseType = 'text', nếu ko thì response sẽ chạy vào case catchError trong intercepter
      }).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError({error: JSON.parse(error.error)});
      })
    );
  }

  switchStatusUser(userId : number){
    const url = this.buildUrl(`/user/update-status/${userId}`);
    return this.http.put(url, null, {
      responseType: 'text'
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError({error: JSON.parse(error.error)});
      })
    );
  }


  getDetailUserById(userId : number): Observable<UserDetailResponsed>{
    const url = this.buildUrl(`/user/get-detail-user/${userId}`);
    return this.http.get<UserDetailResponsed>(url);
  }



}
