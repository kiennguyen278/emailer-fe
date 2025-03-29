import { Directive, HostListener, OnInit } from '@angular/core';
import {NzDatePickerComponent} from "ng-zorro-antd/date-picker";

@Directive({
  selector: '[appendToDatepicker]'
})
export class AppDatePickerScrollDirective implements OnInit {
  constructor(private datePicker: NzDatePickerComponent) {}
  ngOnInit(): void {
    window.addEventListener(
      'scroll',
      () => {
        this.datePicker.checkAndClose();
      },
      true
    );
  }
}
