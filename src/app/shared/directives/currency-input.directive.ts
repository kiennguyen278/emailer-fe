import { Directive, ElementRef, forwardRef, HostListener, Injector, Input, OnInit, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NgControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CurrencyLocalPipe } from '@shared/pipes/currency.pipe';
const CURRENCYDIRECTIVE_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CurrencyInputDirective),
  multi: true
};

interface ICursorPosition {
  start: number;
  end: number;
}

@Directive({
  selector: 'input[formControlName][input-currency], input[formControl][input-currency], input[ngModel][input-currency]',
  providers: [CURRENCYDIRECTIVE_VALUE_ACCESSOR, CurrencyLocalPipe]
})
export class CurrencyInputDirective implements ControlValueAccessor, OnInit {
  @Input() formatOnlyOnBlur = false;
  @Input() set notAllowAfterDecimalPoint(_: any) {
      this.numberWithUpTo2DecimalsRegex = new RegExp(`^([0-9]+)$`);
  }
  private decimalPointSeparator = this.getLocaleDecimalPointSeparator();
  private thousandsSeparator = this.getLocaleThousandsSeparator();

  private ngControl: NgControl;
  private numbersAndDecimalPointSeparatorRegex: RegExp;
  private readonly allowedKeys: string[] = [
    'Backspace',
    'Tab',
    'End',
    'Home',
    'Delete',
    'Del',
    'Ctrl',
    'ArrowLeft',
    'ArrowRight',
    'Left',
    'Right'
  ];
  private readonly allowedKeysUsedWithControl: string[] = ['x', 'c', 'v', 'a', 'z'];
  private numberWithUpTo2DecimalsRegex = new RegExp(`^([0-9]+)?(\\${this.decimalPointSeparator}[0-9]{1,3})?$`);
  private previousRawInputValue = '';

  private onChange: (value: string) => void;
  private onTouch: () => void;

  constructor(
    private currencyPipe: CurrencyLocalPipe,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private injector: Injector
  ) {
    const localeDecimalPointSeparator = this.getLocaleDecimalPointSeparator();
    this.numbersAndDecimalPointSeparatorRegex = new RegExp(`[0-9${localeDecimalPointSeparator}]`, 'g');
  }

  ngOnInit() {
    this.ngControl = this.injector.get(NgControl);
  }

  @HostListener('blur')
  handleBlur() {
    this.reformatInput();
    this.onTouch();
  }

  @HostListener('input', ['$event.target.value', '$event.target', '$event'])
  handleInput(rawInputValue: string, inputEl: HTMLInputElement, event: InputEvent) {
    const enteredData = event.data;
    if (enteredData === this.decimalPointSeparator && this.hasOnlyOneDecimalSeparatorAtTheEnd(rawInputValue)) {
      return;
    }
    if (rawInputValue === '') {
      this.onChange('');
      return;
    }

    const initialCursorPosition = this.getCursorPosition(inputEl);

    if (this.hasNoMoreThan2DecimalDigits(rawInputValue) && !this.isNumberTooLarge(rawInputValue)) {
      const newRawInputValue = this.formatOnlyOnBlur ? rawInputValue : this.formatPriceToUpTo2Decimal(rawInputValue);
      this.previousRawInputValue = newRawInputValue;
      this.onChange(newRawInputValue);
      this.setNativeInputValue(newRawInputValue);

      const diffInSeparators = this.getDiffInSeparators(rawInputValue, newRawInputValue);
      this.moveCursor(inputEl, initialCursorPosition, diffInSeparators);
    } else if (
      enteredData?.length === 1 &&
      enteredData !== this.decimalPointSeparator &&
      initialCursorPosition.start !== rawInputValue?.length &&
      initialCursorPosition.end !== rawInputValue?.length &&
      !this.isNumberTooLarge(rawInputValue)
    ) {
      // This section allows to override numbers after decimal point
      const newRawInputValue = this.replaceAt(this.previousRawInputValue, initialCursorPosition?.start - 1, enteredData);
      this.previousRawInputValue = newRawInputValue;
      this.onChange(newRawInputValue);
      this.setNativeInputValue(newRawInputValue);
      this.moveCursor(inputEl, initialCursorPosition);
    } else {
      this.setNativeInputValue(this.previousRawInputValue);
      const cursorDiff = enteredData ? -enteredData.length : 0;
      this.moveCursor(inputEl, initialCursorPosition, cursorDiff);
    }
  }

  @HostListener('keydown', ['$event'])
  keyDownEvent(event: KeyboardEvent) {
    const ch = event.key;
    if (/^[0-9,]*$/.test(ch)){
       return;
    }
    if (this.isSpecialAllowedKey(event)) {
      return;
    }
    event.preventDefault();
  }

  private isNumberTooLarge(rawInputValue: string): boolean {
    const value = this.parseLocaleStringToNumber(rawInputValue);
    return value >= 100000000000000;
  }

  private replaceAt(originalValue: string, index: number, replacement: string) {
    return originalValue.substr(0, index) + replacement + originalValue.substr(index + replacement.length);
  }

  private isNumberKey(event: KeyboardEvent): boolean {
    return !!event.key && event.key.length === 1 && !!String(event.key).match(this.numbersAndDecimalPointSeparatorRegex);
  }

  private isSpecialAllowedKey(event: KeyboardEvent): boolean {
    return this.allowedKeys.includes(event.key) || this.isAllowedKeyWithControl(event);
  }

  private isAllowedKeyWithControl(event: KeyboardEvent): boolean {
    if (event.ctrlKey || event.metaKey) {
      return (
        this.allowedKeysUsedWithControl.includes(event.key) ||
        this.allowedKeysUsedWithControl.map((key) => key.toUpperCase()).includes(event.key)
      );
    } else {
      return false;
    }
  }

  private getValueWithoutThousandsSeparator(value: string): string {
    return value.split(this.thousandsSeparator).join('');
  }

  private hasNoMoreThan2DecimalDigits(value: string): boolean {
    const valueWithoutSeparators = this.getValueWithoutThousandsSeparator(value);
    return this.numberWithUpTo2DecimalsRegex.test(valueWithoutSeparators);
  }

  private reformatInput(value?: number): void {
    const newValue = value !== undefined ? value : this.ngControl.value;

    if (newValue || newValue === 0) {
      const with2Decimals = this.formatPriceTo2Decimal(newValue);
      this.setNativeInputValue(with2Decimals);
    } else {
      this.setNativeInputValue('');
    }
  }

  private formatPriceTo2Decimal(value: number | string): string {
    const numberToTransform = (typeof value === 'string' ? this.parseLocaleStringToNumber(value) : value) || 0;

    return this.currencyPipe.transform(numberToTransform);
  }

  private formatPriceToUpTo2Decimal(value: string): string {
    // TODO: potential for refactor:
    const numberOfZerosAfterDecimalPointRegex = `^[0-9]*\\${this.decimalPointSeparator}(0+)$`;
    const numberOfZerosAfterFirstDecimalDigitRegex = `^[0-9]*\\${this.decimalPointSeparator}[1-9](0+)$`;

    const valueWithoutSeparators = this.getValueWithoutThousandsSeparator(value);
    const numberOfZerosAfterDecimalPoint =
      valueWithoutSeparators.match(numberOfZerosAfterDecimalPointRegex)?.[1].length || 0;
    const numberOfZerosAfterFirstDecimalDigit =
      valueWithoutSeparators.match(numberOfZerosAfterFirstDecimalDigitRegex)?.[1].length || 0;

    const formatted = this.currencyPipe.transform(this.parseLocaleStringToNumber(valueWithoutSeparators));
    if (numberOfZerosAfterDecimalPoint > 0) {
      return formatted + this.decimalPointSeparator + '00'.slice(0, numberOfZerosAfterDecimalPoint);
    }
    if (numberOfZerosAfterFirstDecimalDigit > 0) {
      return formatted + '0';
    }

    return formatted;
  }

  private getNumberOfThousandsSeparators(value: string): number {
    return (value || '').split(this.thousandsSeparator).length - 1;
  }

  private getDiffInSeparators(oldValue: string, newValue: string): number {
    const initialNumberOfSeparators = this.getNumberOfThousandsSeparators(oldValue);
    const currentNumberOfSeparators = this.getNumberOfThousandsSeparators(newValue);

    return currentNumberOfSeparators - initialNumberOfSeparators;
  }

  private hasOnlyOneDecimalSeparatorAtTheEnd(value: string): boolean {
    return value.split(this.decimalPointSeparator).length === 2 && value.slice(-1) === this.decimalPointSeparator;
  }

  private parseLocaleStringToNumber(value: string): number {
    const cleanPattern = new RegExp(`[^-+0-9${this.decimalPointSeparator}]`, 'g');

    const cleaned = String(value).replace(cleanPattern, '');
    const normalized = cleaned.replace(this.decimalPointSeparator, '.');

    return parseFloat(normalized);
  }

  private setNativeInputValue(value: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'value', value);
  }

  private getNativeInputValue(): string {
    return this.elementRef.nativeElement.value;
  }

  private getCursorPosition(inputEl: HTMLInputElement): ICursorPosition {
    return {
      start: inputEl.selectionStart || 0,
      end: inputEl.selectionEnd || 0
    };
  }

  private setCursorPosition(inputEl: HTMLInputElement, position: ICursorPosition) {
    inputEl.setSelectionRange(position.start >= 0 ? position.start : 0, position.end >= 0 ? position.end : 0);
  }

  private moveCursor(inputEl: HTMLInputElement, initialPosition: ICursorPosition, diff: number = 0): void {
    this.setCursorPosition(inputEl, {
      start: initialPosition.start + diff,
      end: initialPosition.end + diff
    });
  }

  private numberOfDecimalPlaces(value: number | string): number {
    const numString = value + '';
    return numString.split('.')[1]?.length || 0;
  }

  private getLocaleDecimalPointSeparator() {
    const example = this.currencyPipe.transform(1.1);
    return example ? example.charAt(1) : '';
  }

  private getLocaleThousandsSeparator() {
    const example = this.currencyPipe.transform(1000);
    if (example.length === 5) {
      return example.charAt(1);
    } else {
      return '';
    }
  }

  // Value Acecssor Methods:
  registerOnChange(fn: (value: number) => void): void {
    this.onChange = (value: string) => {
      const valueToEmit = value === '' ? null : this.parseLocaleStringToNumber(value);
      fn(valueToEmit || 0);
    };
  }

  registerOnTouched(callbackFunction: () => void): void {
    this.onTouch = callbackFunction;
  }

  setDisabledState(isDisabled: boolean): void {
    this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', isDisabled);
  }

  writeValue(value: number): void {
    this.reformatInput(value);
    this.previousRawInputValue = this.getNativeInputValue();
  }
}
