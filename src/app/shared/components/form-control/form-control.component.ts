import {
  AfterViewInit,
  Component,
  ContentChild,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {
  NgControl,
  FormControlName,
  FormControlDirective
} from '@angular/forms';
import { NzFormControlComponent } from 'ng-zorro-antd/form';

@Component({
  selector: 'app-form-control',
  templateUrl: './form-control.component.html',
  encapsulation: ViewEncapsulation.None
})
export class FormControlComponent implements AfterViewInit {
  @ContentChild(NgControl, { static: false }) content?:
    | FormControlName
    | FormControlDirective;

  @ViewChild(NzFormControlComponent) child!: NzFormControlComponent;

  ngAfterViewInit(): void {
    this.child.defaultValidateControl = this.content;
    this.child.ngAfterContentInit();
  }
}
