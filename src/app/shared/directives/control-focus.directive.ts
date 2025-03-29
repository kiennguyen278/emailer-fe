import { AfterViewInit, Directive, ElementRef } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[controlFocus]'
})
export class ControlFocusDirective implements AfterViewInit {
  constructor(private element: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    this.element.nativeElement.querySelector('input')?.focus();
  }
}
