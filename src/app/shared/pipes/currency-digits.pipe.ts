import { Pipe, PipeTransform } from '@angular/core';
import { NumberUtil } from '@core/utils/number.util';

@Pipe({
  name: 'currencyLocalDigits'
})
export class CurrencyLocalDigitsPipe implements PipeTransform {
  transform(value: any, digits?: any): any {
    return NumberUtil.toCurrencyDigit(value, digits ? digits : 2);
  }
}
