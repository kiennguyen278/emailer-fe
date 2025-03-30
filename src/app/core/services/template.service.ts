import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  constructor(private http: HttpClient) {}

  getFile(template: string) {
    return this.http.get(`assets/templates/${template}.template`, {
      responseType: 'text'
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError({error: JSON.parse(error.error)});
      })
    );
  }
}
