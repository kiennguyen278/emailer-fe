import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-checkbox-view',
  templateUrl: './checkbox-view.component.html'
})
export class CheckboxViewComponent {
  @Input() checked: boolean | undefined;
}
