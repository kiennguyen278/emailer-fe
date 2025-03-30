import { Component, forwardRef, Input, ViewEncapsulation } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ValidationErrors
} from '@angular/forms';
import {
  DATE_FORMAT,
  DATE_SQL_FORMAT,
  DATE_TIME_SQL_FORMAT
} from '@core/constants';
import { format, isValid } from 'date-fns';

@Component({
  selector: 'app-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateRangePickerComponent),
      multi: true
    }
  ]
})
export class DateRangePickerComponent implements ControlValueAccessor {
  @Input() placeholder!: string[];
  @Input() disabled = false;
  @Input() showTime = false;
  @Input() allowClear: boolean = true;
  @Input() format = DATE_FORMAT;
  value!: any[];
  _onChange!: (_: any) => void;
  _onTouched!: (_: any) => void;

  writeValue(obj: any[]): void {
    obj = obj || [null, null];
    const value = obj.map((x) => {
      const date = new Date(x);
      return isValid(date) ? date : null;
    });
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return control.value ? null : { date: true };
  }

  onChange(event: Date[]): void {
    const value = event.map((x) =>
      x
        ? format(
            x,
            this.format === DATE_FORMAT ? DATE_SQL_FORMAT : DATE_TIME_SQL_FORMAT
          )
        : null
    );
    if (this._onChange) {
      this._onChange(value);
    }
  }
}
