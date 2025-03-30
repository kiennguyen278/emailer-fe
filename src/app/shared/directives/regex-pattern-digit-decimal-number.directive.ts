import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[regexPatternDigitDecimalNumber]'
})
export class RegexPatternDigitDecimalNumberDirective {
  @Input('regexPatternDigitDecimalNumber') regexPatternDigitDecimalNumber: RegExp;
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];
  constructor(private el: ElementRef) {
  }
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if ((this.specialKeys.indexOf(event.key) !== -1) || ((event.ctrlKey || event.metaKey) && event.keyCode == 86)) {
      return;
    }
    let current: string = this.el.nativeElement.value;
    const position = this.el.nativeElement.selectionStart;
    const next: string = [current.slice(0, position), event.key == 'Decimal' ? '.' : event.key, current.slice(position)].join('');
    if (next && !String(next).match(this.regexPatternDigitDecimalNumber)) {
      event.preventDefault();
    }
  }
}
