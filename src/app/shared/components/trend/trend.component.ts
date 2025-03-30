import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'trend',
  templateUrl: './trend.component.html',
  styleUrls: ['./trend.component.less'],

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrendComponent {
  @Input() flag: 'up' | 'down';
  @Input() colorful: boolean = true;
  @Input() reverseColor: boolean = false;

}
