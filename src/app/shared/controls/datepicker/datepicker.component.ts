import { Component, forwardRef, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator
} from '@angular/forms';
import {
  DATE_FORMAT,
  DATE_SQL_FORMAT,
  DATE_TIME_FORMAT,
  DATE_TIME_FULL_FORMAT,
  DATE_TIME_SQL_FORMAT
} from '@core/constants';
import { format, isValid } from 'date-fns';
import { DisabledTimeFn } from 'ng-zorro-antd/date-picker';

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatepickerComponent),
      multi: true
    }
  ]
})
export class DatepickerComponent implements ControlValueAccessor, Validator {
  @Input() placeholder = '';
  @Input() disabled = false;
  @Input() showTime = false;
  @Input() showFullTime = false;
  @Input() format = DATE_FORMAT;
  @Input() allowClear: boolean = true;
  @Input() disabledDate: (current: Date) => boolean;
  @Input() disabledTime: DisabledTimeFn;
  @Input() timeDefaultValue: Date = new Date();
  @Input() id: any;
  @Input() showToday = true;
  @Input() defaultSelectDate: Date;
  @Input() hideDisabledOptions: boolean = true;
  @ViewChild('datePickerRef') datePickerRef: any;
  value!: Date | null;
  _onChange!: (_: any) => void;
  _onTouched!: (_: any) => void;

  writeValue(obj: any): void {
    const date = new Date(obj);
    this.value = obj && isValid(date) ? date : null;
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return control.value ? null : { date: true };
  }

  onChange(event: Date): void {
    let formatStr = '';
    switch (this.format) {
      case DATE_FORMAT:
        formatStr = DATE_SQL_FORMAT;
        break;
      case DATE_TIME_FORMAT:
        formatStr = DATE_TIME_SQL_FORMAT;
        break;
      case DATE_TIME_FULL_FORMAT:
        formatStr = DATE_TIME_SQL_FORMAT;
        break;
      case DATE_TIME_FULL_FORMAT:
        formatStr = DATE_TIME_SQL_FORMAT;
        break;
      default:
        break;
    }
    const value = isValid(event) ? format(event, formatStr) : null;

    if (this._onChange) {
      this._onChange(value);
    }
  }
}
