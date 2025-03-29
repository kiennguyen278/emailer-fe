import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ModuleQuill } from '@core/constants';

@Component({
  selector: 'app-richtext',
  templateUrl: './richtext.component.html',
  styleUrls: ['./richtext.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RichtextComponent),
      multi: true
    }
  ]
})
export class RichtextComponent implements ControlValueAccessor {
  @Input() placeholder = '';
  @Input() disabled = false;
  @Input() maxLength: number;
  @Input() rows: number = 1;
  // @Input() formatName: boolean = false;
  @Output() enter = new EventEmitter<boolean>();
  modules = {};
  @Input() inputType: 'input' | 'textarea' = 'textarea';
  @Input() fieldCode: string = '';

  moduleQuill = ModuleQuill;

  constructor(
  ) {}

  value!: string;

  _onChange!: (_: any) => void;
  _onTouched!: (_: any) => void;

  onChange(event: any): void {
    if (event === '') {
      event = null;
      this.value = event;
    }
    if (this._onChange) {
      this._onChange(event);
    }
  }

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

  onEnter(val: any) {
    this.enter.emit(val);
  }

  setValueTextInput(value: string) {
    const val = this.value ? `${this.value} ${value}` : value;
    this.value = this.trimString(val);
    this.onChange(val);
  }

  trimString(str: string) {
    if (this.maxLength && str.length > this.maxLength) {
      return str.substring(0, this.maxLength);
    } else {
      return str;
    }
  }

}
