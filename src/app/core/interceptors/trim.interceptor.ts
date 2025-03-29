import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpParams,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { isEmpty } from 'lodash';
import { Observable } from 'rxjs';
import { ObjUtil } from "@core/utils/obj.util";

@Injectable()
export class TrimInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    const requestExcludeTrimUrl: string[] = [];

    const isRequestExcludeTrim = requestExcludeTrimUrl.some(item => req.url.includes(item));

    if (isRequestExcludeTrim){
      return next.handle(req);
    }

    const update: any = {};
    if (!isEmpty(req.body)) {
      update.body = ObjUtil.trim(req.body);
    }
    if (!isEmpty(req.params)) {
      update.params = new HttpParams();

      let appendParams = {};
      req.params.keys().forEach((key) => {

        const aaa = req.params.getAll(key)?.map(item => {
          if (typeof item === 'string'){
            return item.trim()
          } return item
        });
        appendParams = {...appendParams, [key]: aaa}
      });

      if (!isEmpty(appendParams)){
        update.params = update.params.appendAll(appendParams)
      }
    }

    let newReq: HttpRequest<any> = req.clone(update);
    return next.handle(newReq);
    // return next.handle(req);
  }
}
