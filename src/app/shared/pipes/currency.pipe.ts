import { Pipe, PipeTransform } from '@angular/core';
import { NumberUtil } from '@core/utils/number.util';

@Pipe({
  name: 'currencyLocal'
})
export class CurrencyLocalPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    return NumberUtil.toCurrency(value);
  }
}
