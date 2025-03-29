import { Directive, HostListener} from '@angular/core';
import { NgControl } from '@angular/forms';;

@Directive({
  selector: '[csTrimSpaceInput]'
})
export class TrimSpaceInputDirective{
  constructor(
    private control: NgControl
  ) {
  }

  @HostListener('paste', ['$event'])
  onPaste(event: any) {
    if(event.target) {
      setTimeout(() => {
        const maxlength = event.target.getAttribute('maxlength')
        let value = this.control.control?.value.trim()
        if(maxlength) {
          value = value.slice(0, maxlength)
        }
        this.control.control?.setValue(value?.trim())
        this.control.control?.markAsDirty()
      }, 10)
    }
  }

  @HostListener('keypress', ['$event'])
  onKeypress(event: any) {
    if(event.key == ' ' && (!event.target.value || event.target.value[event.target.value?.length - 1] == ' ')) {
      event.preventDefault();
      this.control.control?.markAsDirty()
    }
  }

}
