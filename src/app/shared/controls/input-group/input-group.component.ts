import {
  Component,
  forwardRef,
  Input,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input-group',
  templateUrl: './input-group.component.html',
  styleUrls: ['./input-group.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputGroupComponent),
      multi: true
    }
  ]
})
export class InputGroupComponent implements ControlValueAccessor {
  @Input() placeholder = 'Nhập';
  @Input() disabled = false;
  @Input() maxLength: number;
  @Input() minLength: number;
  @Input() width: string;
  @Input() prefix: string | TemplateRef<void>;
  @Input() suffix: string | TemplateRef<void>;
  @Input() allowClear = false;

  value: string;

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
