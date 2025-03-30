import {
  DATE_SQL_FORMAT,
  DATE_TIME_SQL_FORMAT,
  DATE_FORMAT,
} from '@core/constants';
import { format, parseISO } from 'date-fns';

export class DateUtil {
  static today() {
    return DateUtil.formatSQL(new Date());
  }

  static now() {
    return DateUtil.formatTimeSQL(new Date());
  }

  static formatDate(date: Date, formatStr = DATE_FORMAT){
    return format(date, formatStr);
  }

  static formatSQL(date: Date, formatStr = DATE_SQL_FORMAT) {
    return format(date, formatStr);
  }

  static formatTimeSQL(date: Date, formatStr = DATE_TIME_SQL_FORMAT) {
    return format(date, formatStr);
  }

}
