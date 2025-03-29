import { format, isValid } from 'date-fns';
import { Component, forwardRef, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import { DATE_FORMAT, DATE_SQL_FORMAT, DATE_TIME_FORMAT, DATE_TIME_FULL_FORMAT, DATE_TIME_SQL_FORMAT, YEAR_FORMAT } from '@core/constants';

@Component({
  selector: 'app-year-picker',
  templateUrl: './year-picker.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => YearPickerComponent),
      multi: true
    }
  ]
})
export class YearPickerComponent implements ControlValueAccessor, Validator {

  @Input() disabled = false;
  @Input() placeholder = 'yyyy';
  @Input() format = YEAR_FORMAT;
  @Input() disabledDate: (current: Date) => boolean;
  @Input() allowClear: boolean = true;
  value!: Date | null;
  _onChange!: (_: any) => void;

  constructor() { }

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
      case YEAR_FORMAT:
        formatStr = YEAR_FORMAT;
        break;
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
