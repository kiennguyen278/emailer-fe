import { Directive, ElementRef, HostListener, OnInit } from '@angular/core';

@Directive({
  selector: '[InsuranceCardNo]'
})
export class InsuranceCardNoDirective implements OnInit {
  private regex: RegExp = /^([A-Za-z0-9]{2})(\d{1})(\d{2})(\d{10})$/;

  constructor(private el: ElementRef) { }

  ngOnInit() {
    let value: string = this.el.nativeElement.value;
    if (value && value.trim() !== '') {
      value = value.replace(this.regex, '$1-$2-$3-$4');
      this.el.nativeElement.value = value;
    }
  }

  @HostListener('input', ['$event'])
  onInputChange(event: any) {
    const initialValue: string = this.el.nativeElement.value?.replaceAll('-', '');
    if (initialValue && initialValue.trim() !== '') {
      let newValue: string = '';
      if (initialValue.length === 3) {
        newValue = initialValue.replace(/^([A-Za-z0-9]{2})(\d{1})$/, '$1-$2');
        event.target.value = newValue;
      } else if (initialValue.length === 5 && initialValue.length) {
        newValue = initialValue.replace(/^([A-Za-z0-9]{2})(\d{1})(\d{2})$/, '$1-$2-$3');
        event.target.value = newValue;
      } 
      else if (initialValue.length === 15) {
        newValue = initialValue.replace(this.regex, '$1-$2-$3-$4');
        event.target.value = newValue;
        // event.target.dispatchEvent(new Event('input'));
      }
    }
  }
}