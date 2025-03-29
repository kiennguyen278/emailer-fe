import { Component, forwardRef, Input, Output, ViewEncapsulation, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { InputBoolean } from 'ng-zorro-antd/core/util';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true
    }
  ]
})
export class CheckboxComponent implements ControlValueAccessor {
  @Input() label!: string;
  @Input() indeterminate!: string;
  @Input() @InputBoolean() disabled = false;
  @Input() @InputBoolean() isSetting = false;
  @Output() enter = new EventEmitter<boolean>();
  value!: boolean;

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

  onChange(event: boolean): void {
    if (this._onChange) {
      this._onChange(event);
    }
  }

  keyupEnterValue(event: boolean): void {
    this.value = !event;
    this.onChange(this.value)
  }
}
