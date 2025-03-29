import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { LocalStorageUtil } from "@core/utils/local-storage.util";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@core/constants/local-storage.constants.key";
import { ChangePasswordRequest, LoginRequest, LoginResponsed } from '@modules/auth/models';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BaseApiService } from '@core/services';

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
      .post(this.buildUrl('refresh-token'), {
        params: {
          token: this.refreshToken
        }
      })
      .pipe(
        catchError(() => of(false)),
        switchMap((response: any) => {
          this.accessToken = response.accessToken;
          this._authenticated = true;
          return of(true);
        })
      );
  }


  login(params: LoginRequest): Observable<LoginResponsed> {
    const url = this.buildUrl(`/auth/login`);
    return this.http.post<LoginResponsed>(url, params, httpOptions);
  }


  changePassword(body: ChangePasswordRequest){

    const url = this.buildUrl('/user/change-password');
    return this.http.put(url, body,{
      responseType: 'text'
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
        // return throwError({error: JSON.parse(error.error)});
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
