import { Directive, ElementRef, HostListener } from '@angular/core';

const DISABLE_TIME = 1000;

@Directive({
  selector: 'button[prevent-double-click]'
})
export class PreventDoubleClickDirective {
  constructor(private elementRef: ElementRef) {}
  @HostListener('click', ['$event'])
  clickEvent() {
    this.elementRef.nativeElement.setAttribute('disabled', 'true');
    setTimeout(
      () => this.elementRef?.nativeElement?.removeAttribute('disabled'),
      DISABLE_TIME
    );
  }
}
