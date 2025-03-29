import { Directive, HostListener, OnInit } from '@angular/core';
import { NzSelectComponent } from 'ng-zorro-antd/select';

@Directive({
  selector: '[appendToSelect]'
})
export class AppSelectUpdatePositionDirective implements OnInit {
  constructor(private select: NzSelectComponent) {}
  ngOnInit(): void {
    window.addEventListener(
      'scroll',
      () => {
        if (this.select.nzOpen) {
          // this.select.setOpenState(false);
          console.log('vào đây appendToSelect')
          this.select.updateCdkConnectedOverlayPositions();
        }
      },
      true
    );
  }
}
