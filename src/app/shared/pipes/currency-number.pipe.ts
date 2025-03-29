import { Pipe, PipeTransform } from '@angular/core';
import { NumberUtil } from '@core/utils/number.util';

@Pipe({
  name: 'currencyNumberDigits'
})
export class CurrencyNumberDigitsPipe implements PipeTransform {
  transform(value: any, digits?: any): any {
    return NumberUtil.toCurrencyDigit(value, digits ? digits : 0);
  }
}
