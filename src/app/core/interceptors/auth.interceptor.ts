import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotificationService } from '@core/services/notification.service';
import {BehaviorSubject, Observable, of, throwError} from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import {AuthService} from "@core/services/auth.service";
import {TokenStorageService} from "@core/services/token-storage.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<boolean>(false);

  constructor(
    private authService: AuthService,
    private notification: NotificationService,
    private router: Router,
    private tokenStorage: TokenStorageService,
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let newReq: HttpRequest<any> = req.clone();
    if (this.authService.accessToken) {
      newReq = this.addTokenHeader(req);
    }
    if (!window.navigator.onLine) {
      // if there is no internet, throw a HttpErrorResponse error
      // since an error is thrown, the function will terminate here
      this.notification.open({
        type: 'error',
        content: 'Internet is offline'
      });
      return throwError(
        new HttpErrorResponse({
          error: 'Internet is offline'
        })
      );
    }
    return next.handle(newReq).pipe(
      catchError((error: HttpErrorResponse) => {

        // if (error.status === 401){
        //    this.logoutExpired()
        //   return throwError(error); // ko có refresh token nên logout luôn nếu hết hạn
        // }

        if (!newReq.url.includes('/auth/refresh-token') && error.status === 403) {
          return this.handle401Error(newReq, next);
        }

        if ([0, 500].includes(error.status) || !navigator.onLine) {
          this.notification.open({
            type: 'error',
            content: error?.message || 'Có lỗi xảy ra'
          });
        }

        return throwError(error);
      })
    );
  }

  private logoutExpired(){
    this.notification.open({
      type: 'error',
      content: 'Hết hạn phiên đăng nhập, vui lòng đăng nhập lại',
      duration: 7000,
    });

    this.tokenStorage.signOut();
  }

  private handle401Error(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(false);
      return this.authService.signInUsingRefreshToken().pipe(
        switchMap((authenticated: boolean) => {
          if (!authenticated) return throwError(new Error('Refresh token'));
          this.isRefreshing = false;
          this.refreshTokenSubject.next(true);
          return next.handle(this.addTokenHeader(request));
        }),
        catchError((err: any) => {
          console.error('handle401Error', err);
          this.logoutExpired();
          this.isRefreshing = false;
          // location.assign('/auth/login');
          return of(err);
        })
      );
    }
    return this.refreshTokenSubject.pipe(
      filter((authenticated: boolean) => authenticated),
      take(1),
      switchMap(() => next.handle(this.addTokenHeader(request)))
    );
  }

  private addTokenHeader(request: HttpRequest<any>): HttpRequest<any> {
    return request.clone({

      headers: request.headers.set(
        'Authorization',
        `Bearer ${this.authService.accessToken}`
      ) // tạm thời bỏ authentication đi,


      //   .set(
      //   'apikey',
      //   'top-secret-key'
      // )
    });
  }
}
