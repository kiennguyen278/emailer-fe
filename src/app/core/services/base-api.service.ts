import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {Observable, throwError} from "rxjs";
import {NotificationService} from "@core/services/notification.service";
import {BASE_API_URL } from "@core/constants/injection-token.constants";

@Injectable()
export abstract class BaseApiService {
  protected endpoint!: string; // khi nào path api KHÔNG CÓ dấu slash (/) ở đầu thì phải có overwrite endpoint, nếu CÓ đấu slash (/) thì KHÔNG cần overwrite endpoint nữa
  constructor(
    protected http: HttpClient,
    protected router: Router,
    private notification: NotificationService,
    @Inject(BASE_API_URL) private apiUrl: string
  ) {}


  protected buildUrl(url: string | number = ''): string {
    return typeof url === 'string' && url.startsWith('/')
      ? `${this.apiUrl}${url}`
      : `${this.endpoint}/${url}`;
  }

  handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred BaseApiService:', error.error.message);
    } else {
      const err = error.error.error;
      this.notification.open({
        type: 'error',
        content: err.message
      });
    }
    return throwError(error.error.error);
  }

}
