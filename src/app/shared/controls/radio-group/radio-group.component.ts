import { Component, forwardRef, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { OptionModel } from '@core/models';

@Component({
  selector: 'app-radio-group',
  templateUrl: './radio-group.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioGroupComponent),
      multi: true
    }
  ]
})
export class RadioGroupComponent implements ControlValueAccessor {
  @Input() options: OptionModel<any>[] = [];
  @Input() disabled = false;

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

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onChange(event: any): void {
    if (this._onChange) {
      this._onChange(event);
    }
  }
}
