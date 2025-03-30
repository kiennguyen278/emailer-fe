import { OptionModel } from '@core/models/option.model';
import { get } from 'lodash';

export class ObjUtil {
  static deleteNullProp(obj: any) {
    for (const prop in obj) {
      if (obj[prop] == null || obj[prop]?.length === 0) {
        delete obj[prop];
      }
    }
    return obj;
  }

  // static deepRemoveEmpty(obj: { [key: string]: any }) {
  //   return Object.keys(obj)
  //     .filter(function (k) {
  //       return obj[k] != null;
  //     })
  //     .reduce(function (acc, k) {
  //       acc[k] = typeof obj[k] === "object" ? ObjUtil.deepRemoveEmpty(obj[k]) : obj[k];
  //       return acc;
  //     }, {});
  // }

  static mapOptions<T = string>(data: any[]): OptionModel<T>[] {
    return data.map((x) => ({ value: x.id, label: x.name, code: x.code }));
  }

  static mapAddressOptions<T = string>(data: any[]): OptionModel<T>[] {
    return data.map((x) => ({ value: x.id, label: x.name, shortCode: x.shortCode }));
  }

  static trim(obj: any): any {
    return JSON.parse(JSON.stringify(obj).replace(/\"\s+|\s+\"/g, '"'));
  }

  static join(arr: any[], key = 'name'): any {
    return arr.map((item) => get(item, key)).join(', ');
  }
  static removeSpace(obj: any): any {
    return JSON.parse(JSON.stringify(obj).replace('\\t', '').replace('\t', ''));
  }
  static clearSpecieCharacter(input: string): string {
    return input
      .trim()
      .replace('%', '\\%')
      .replace('_', '\\_')
      .replace('[', '\\[')
      .replace(']', '\\]')
      .replace('-', '\\-')
      .replace('+', '\\+')
      .replace('^', '\\^');
  }
}
