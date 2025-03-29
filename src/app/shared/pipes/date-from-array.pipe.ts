import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { DATE_FORMAT, DATE_TIME_FORMAT } from '@core/constants';

@Pipe({
  name: 'dateFromArray'
})
export class DateFromArrayPipe extends DatePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    // return value.join('-').;
    const format = args ? DATE_TIME_FORMAT : DATE_FORMAT;
    return super.transform(value.slice(0,-3).join('-'), format);
  }

}
