import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[regexPatternAllow]'
})
export class RegexPatternDirective {
  @Input('regexPatternAllow') regex: RegExp;

  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    if (
      this.regex.test(event.key) || [
        'Backspace',
        'ArrowLeft',
        'ArrowRight',
        'Tab',
        'Home',
        'End',
        'Delete'
      ].includes(event.key) ||
      ((event.ctrlKey || event.metaKey) && event.keyCode == 86) ||
      ((event.ctrlKey || event.metaKey) && event.key === 'a') ||
      ((event.ctrlKey || event.metaKey) && event.key === 'x') ||
      ((event.ctrlKey || event.metaKey) && event.key === 'c') ||
      ((event.ctrlKey || event.metaKey) && event.key === 'v')
    ) {
      return;
    }
    event.preventDefault();
  }
}
