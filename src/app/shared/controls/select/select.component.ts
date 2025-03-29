import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { OptionModel } from '@core/models';
import { Subject } from 'rxjs';
import { debounceTime, skip } from 'rxjs/operators';
import { OptionGroupLabel } from '@core/models/option.model';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ]
})
export class SelectComponent
  implements ControlValueAccessor, OnInit, OnDestroy, OnChanges
{
  @Input() placeholder = '';
  @Input() dropdownClassName = '';
  @Input() maxTagCount = 100;
  @Input() disabled = false;
  @Input() isMulti = false;
  @Input() optionHeight = 32.5;
  @Input() options: OptionModel<any>[] | null = [];
  @Input() allowClear = false;
  @Input() showSearch = false;
  @Input() showBorderWarning = false;
  @Input() customerSearch = true;
  @Input() isLoading: boolean | null = false;
  @Input() isApiSearch = false;
  @Input() isTable: boolean | undefined = false;
  @Input() headerLabel: OptionGroupLabel[] = [];
  @Input() isExtendWidth: boolean | undefined = false;
  @Input() additionalValue: any;
  @Input() nzDropdownStyle: any | undefined;
  @Input() myId: string;
  @Input() filterDisableOption: boolean = false;
  @Output() onApiSearch = new EventEmitter();
  @Output() byLoadmore = new EventEmitter();
  @Output() csChange = new EventEmitter();
  apiSearch$ = new Subject();

  isOnSearch = false;

  value: string;
  keyword: string = '';
  filteredOptions: OptionModel<any>[] | null = [];
  referenceList: any[] = [];

  _onChange!: (_: any) => void;
  _onTouched!: (_: any) => void;

  ngOnInit() {
    this.filteredOptions = this.getOptions();
    if (
      this.additionalValue &&
      !this.filteredOptions?.find((x) => x.value === this.additionalValue.value)
    ) {
      this.filteredOptions?.unshift(this.additionalValue);
    }

    this.apiSearch$
      .asObservable()
      .pipe(skip(1), debounceTime(500))
      .subscribe((event: any) => {
        event = event?.trim();
        this.onApiSearch.emit(event);
      });
    this.apiSearch$.next(null);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes != null &&
      changes['options'] != null &&
      !changes['options'].firstChange
    ) {
      this.options = changes['options'].currentValue;
      this.filteredOptions = this.options;
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

  onChange(event: any): void {
    if (this._onChange) {
      this._onChange(event);
    }
    let data = this.options?.find((x) => x.value == event);
    if (!data && this.additionalValue && this.additionalValue.value === event) {
      data = this.additionalValue;
    }
    this.csChange.emit(data);
  }

  onScrollToBottom() {
    this.byLoadmore.emit();
  }

  search(event: any) {
    event = event?.trim();
    if (this.isApiSearch) {
      if (this.isOnSearch) {
        this.apiSearch$.next(event);
      }
      this.isOnSearch = true;
    } else {
      this.keyword = event || '';
      this.filteredOptions = this.getOptions();
    }
  }

  getOptions(): OptionModel<any>[] | null {
    const options = this.filterDisableOption ? (this.options?.filter(item => !item.disabled) || []) : this.options;

    if (!this.customerSearch) {
      return options;
    } else {
      return (
        options?.filter((x: any) => {
          return (
            x?.shortCode
              ?.toLowerCase()
              ?.includes(this.keyword?.toLowerCase()) ||
            x?.label?.toLowerCase()?.includes(this.keyword?.toLowerCase())
          );
        }) || []
      );
    }
  }

   async onOpenChange(isOpen: boolean){
    // lọc các option đã disable khỏi display list khi open option
    const options = await this.getOptionByOpenStatus(isOpen);
    this.filteredOptions = options;
  }

  getOptionByOpenStatus(isOpen: boolean){

    return (this.filterDisableOption && isOpen) ? (this.options?.filter(item => !item.disabled) || []) : this.options;

  }

  ngOnDestroy() {
    // this.apiSearch$.next();
    this.apiSearch$.complete();
  }
}
