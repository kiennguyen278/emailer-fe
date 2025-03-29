import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import {
  DATE_FORMAT,
  DATE_TIME_FORMAT,
  DATE_TIME_FULL_FORMAT,
  YEAR_FORMAT,
} from '@core/constants';

const formats = {
  time: DATE_TIME_FORMAT,
  date: DATE_FORMAT,
  fullTime: DATE_TIME_FULL_FORMAT,
  year: YEAR_FORMAT
};

@Pipe({
  name: 'dateTime'
})
export class DateTimePipe extends DatePipe implements PipeTransform {
  transform(value: any, args?: any): any {
    const format = args ? formats[args] : formats.date;
    return super.transform(value, format);
  }
}
