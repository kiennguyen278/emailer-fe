import { format, isValid } from 'date-fns';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator
} from '@angular/forms';
import { Component, forwardRef, Input, ViewEncapsulation } from '@angular/core';
import { DATE_SQL_FORMAT, TIME_FORMAT } from '@core/constants';

@Component({
  selector: 'app-timepicker',
  templateUrl: './timepicker.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimepickerComponent),
      multi: true
    }
  ]
})
export class TimepickerComponent implements ControlValueAccessor, Validator {
  @Input() disabled = false;
  @Input() placeholder = 'HH:mm';
  @Input() format = TIME_FORMAT;
  @Input() allowClear: boolean = true;

  _onChange!: (_: any) => void;
  _onTouched!: (_: any) => void;
  value!: any;
  constructor() {}

  validate(control: AbstractControl): ValidationErrors | null {
    return control.value ? null : { date: true };
  }

  writeValue(obj: any): void {
    this.value = obj ? obj : null;
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onChange(event: Date): void {
    let formatStr = '';
    switch (this.format) {
      case TIME_FORMAT:
        formatStr = TIME_FORMAT;
        break;
      default:
        break;
    }
    const time = `${new Date(event).getHours()}:${new Date(
      event
    ).getMinutes()}`;  
    this.value = event && isValid(event) ? event : null;
    const value = isValid(event) ? format(event, formatStr) : null;
    if (this._onChange) {
      this._onChange(value);
    }
  }
}
