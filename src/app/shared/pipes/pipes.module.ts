import { NgModule } from '@angular/core';
import { CurrencyLocalDigitsPipe } from './currency-digits.pipe';
import { CurrencyNumberDigitsPipe } from './currency-number.pipe';
import { CurrencyLocalPipe } from './currency.pipe';
import { DateFromArrayPipe } from './date-from-array.pipe';
import { DateTimePipe } from './datetime.pipe';
import { JoinPipe } from './join.pipe';
import { NumberToTextPipe } from './number-to-text.pipe';
import { OptionClassPipe } from './option-class.pipe';
import { OptionLabelPipe } from './option-label.pipe';
import { SafeHtmlPipe } from './safe-html.pipe';
import { CurrencyTotalPipe } from './currency-total.pipe';
import { RowSpanPipe } from './rowspan';

const pipes = [
  DateTimePipe,
  OptionLabelPipe,
  SafeHtmlPipe,
  OptionClassPipe,
  CurrencyLocalPipe,
  JoinPipe,
  DateFromArrayPipe,
  NumberToTextPipe,
  CurrencyLocalDigitsPipe,
  CurrencyNumberDigitsPipe,
  CurrencyTotalPipe,
  RowSpanPipe
];

@NgModule({
  declarations: pipes,
  exports: pipes
})
export class PipesModule {}
