import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';
import { LocalStorageUtil } from "@core/utils/local-storage.util";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@core/constants/local-storage.constants.key";
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import {BaseApiService} from "@core/services/base-api.service";
import {LoginRequest, LoginResponsed, UserInfo} from "@core/models/auth.models";
import jwt_decode from "jwt-decode";
import {ApiResponse} from "@core/models";

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept-Language': 'vi'
    // 'apikey': 'top-secret-key'
  }),
};


@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseApiService {
  private _authenticated = false;
  protected override endpoint = this.buildUrl('/user');

  get accessToken(): string {
    return LocalStorageUtil.getItem(ACCESS_TOKEN_KEY);
  }

  set accessToken(token: string) {
    LocalStorageUtil.setItem(ACCESS_TOKEN_KEY, token);
  }

  get refreshToken(): string {
    return LocalStorageUtil.getItem(REFRESH_TOKEN_KEY);
  }

  set refreshToken(token: string) {
    LocalStorageUtil.setItem(REFRESH_TOKEN_KEY, token);
  }

  signIn(body: any) {
    return this.http.post(this.buildUrl('login'), body);
  }

  signInUsingRefreshToken() {
    // const refreshToken
    return this.http
      .post(this.buildUrl('/auth/refresh-token'), null, {params: {refreshToken: this.refreshToken}})
      .pipe(
        catchError((error) => {
          this._authenticated = false;
          return throwError(error);
        }),
        switchMap((response: any) => {
          this.accessToken = response.data;
          this._authenticated = true;
          return of(true);
        })
      );
  }


  login(params: LoginRequest): Observable<any> {
    const url = this.buildUrl(`/auth/login`);
    return this.http.post<LoginResponsed>(url, params, httpOptions)
      .pipe(
        switchMap((loginResponse: LoginResponsed) => {

          this.accessToken = loginResponse.data.accessToken;
          this.refreshToken = loginResponse.data.refreshToken;
          const jwtTokenParse = jwt_decode(loginResponse.data.accessToken);

          return this.getUserInfo().pipe(
            map((userInfo) => ({
              loginResponse: loginResponse,
              userInfo: userInfo.data
            }))
          );
        })
      );
  }

  getUserInfo():Observable<ApiResponse<UserInfo>>{
    const url = this.buildUrl(`/users/me`);
    return this.http.get<ApiResponse<UserInfo>>(url).pipe(
      catchError((err) => {
        localStorage.clear();
        return throwError(err)
      }), // clear localStore nếu get thông tin userInfo lỗi để chặn login luôn
      switchMap((response: ApiResponse<UserInfo>) => {
        return of(response);
      })
    );
  }


  check(): Observable<boolean> {
    // Check if the user is logged in
    if (this._authenticated) {
      return of(true);
    }

    if (this.accessToken) {
      return of(true);
    }

    // Check the access token availability
    if (!this.refreshToken) {
      return of(false);
    }

    return of(false);
    // If the access token exists and it didn't expire, sign in using it
    // return this.signInUsingRefreshToken(); // ko có refresh token nên return false luôn
  }
}
