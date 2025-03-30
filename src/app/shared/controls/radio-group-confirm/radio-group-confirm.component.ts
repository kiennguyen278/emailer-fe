import { Component, forwardRef, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { OptionModel } from '@core/models/option.model';

@Component({
  selector: 'app-radio-group-confirm',
  templateUrl: './radio-group-confirm.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioGroupConfirmComponent),
      multi: true
    }
  ]
})
export class RadioGroupConfirmComponent implements ControlValueAccessor {
  @Input() options: OptionModel<any>[] = [];
  value!: any;
  _onChange!: (_: any) => void;
  _onTouched!: (_: any) => void;

  writeValue(obj: any): void {
    this.value = obj;
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  onChange(event: any): void {
    if (this._onChange) {
      this._onChange(event);
    }
  }

  cancelChange() {
  }

  confirmChange(value: any) {
    this.onChange(value);
    this.value = value;

  }

  onChangeVal(event: any) {
    event.currentTarget.checked = false;
  }

}
