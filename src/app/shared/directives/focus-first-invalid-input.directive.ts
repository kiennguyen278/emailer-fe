import { Directive, ElementRef } from '@angular/core';
import {InvalidFormError} from "@core/utils/form.util";

@Directive({
  selector: '[focusInvalidInput]',
  exportAs: 'focusInvalidInput'
})
export class FormAutoFocus {

  constructor(private el: ElementRef) { }

  public focus():void{
    const invalidControl = this.el.nativeElement.querySelector('input.ng-invalid');
    if (invalidControl) {
      invalidControl.focus();
    }

  }
}
