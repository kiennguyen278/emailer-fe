import {
  DATE_SQL_FORMAT,
  DATE_TIME_SQL_FORMAT,
  DATE_FORMAT,
} from '@core/constants';
import { format, parseISO } from 'date-fns';
import {HttpParams} from "@angular/common/http";

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

  /**
   * Chuyển chuỗi dạng '7d', '2w', '1m' → số ngày
   */
  static convertToDays(range: string): number {
    const match = range.match(/^(\d+)([dwm])$/);
    if (!match) return 0;

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case 'd': return value;
      case 'w': return value * 7;
      case 'm': return value * 30;
      default: return 0;
    }
  }

  /**
   * Trả về HttpParams với startDate = now, endDate = now + days
   */
  static buildDateRangeParams(days: number): HttpParams {
    const now = new Date();
    const startDate = now.toISOString();

    const end = new Date(now);
    end.setDate(end.getDate() + days);
    const endDate = end.toISOString();

    return new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
  }

  /**
   * Trả về HttpParams từ range string như '7d', '2w', '1m'
   */
  static buildDateRangeParamsFromRange(range: string): HttpParams {
    const days = DateUtil.convertToDays(range);
    return DateUtil.buildDateRangeParams(days);
  }

}
