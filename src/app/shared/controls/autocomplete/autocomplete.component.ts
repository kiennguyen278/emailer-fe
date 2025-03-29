import {
  AfterViewInit,
  Component,
  ElementRef, EventEmitter,
  forwardRef,
  Input, OnChanges, OnInit, Output, SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { OptionModel } from '@core/models';
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutocompleteComponent),
      multi: true
    }
  ]
})
export class AutocompleteComponent
  implements ControlValueAccessor, AfterViewInit, OnChanges, OnInit
{
  @Input() placeholder = '';
  @Input() options: OptionModel[] | null = [];
  @Input() disabled = false;
  @Input() maxlength: number;
  @Output() keyUpEnter = new EventEmitter();
  @ViewChild('input') input!: ElementRef;
  value!: string;

  _onChange!: (_: any) => void;
  _onTouched!: (_: any) => void;

  displayOptions: OptionModel[] | null = [];

  ngAfterViewInit(): void {
    fromEvent<Event>(this.input.nativeElement, 'input').pipe(
      map((e) => (e.target as HTMLInputElement).value)
    );
  }

  ngOnInit(){
    this.displayOptions = this.options;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes != null){
      this.displayOptions = this.options;
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

  onChange(event: any): void {

    if (event){
      const arrFilter = this.options?.filter((item: OptionModel) => {
        const labelLowercase = item.label.toLowerCase();
        const keyword = event.trim().toLowerCase();
        return labelLowercase.includes(keyword)
      }) || [];
      this.displayOptions = arrFilter;
    } else {
      this.displayOptions = this.options;
    }

    if (this._onChange) {
      this._onChange(event);
    }
  }
}
