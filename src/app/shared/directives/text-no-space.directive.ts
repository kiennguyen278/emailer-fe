import { Directive, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';


@Directive({
  selector: '[noSpaceText]'
})

export class NoSpaceTextDirective {
  constructor(
    private control: NgControl
  ) { }


  @HostListener('keydown', ['$event'])
  keyDownEvent(event: KeyboardEvent) {
    const ch = event.key;
    if (/^\S*$/.test(ch)){
      return;
    }
    event.preventDefault();
  }
}
