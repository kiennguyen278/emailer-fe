import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { ResponseModel } from "@core/models";
/*
  xử lý dữ liệu chung 
  */
@Injectable({
  providedIn: 'root'
})
export class DataService {

  isEmpty(object: any) {
    return object === null || object == undefined || (object instanceof Object && Object.keys(object).length == 0) || (object instanceof String && object === "") || (object instanceof Array && object.length == 0)
  }

  arrayToString(objects: any[], propertyName: string, delim: string) {
    delim = delim || ",";
    let result = "";
    if (!this.isEmpty(objects)) {
      for (let o in objects) {
        result += (o[propertyName] + delim);
      }
      result = result.substring(0, result.length - delim.length);
    }
    return result;
  }

}
