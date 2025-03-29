import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-title-box',
  templateUrl: './title-box.component.html',
})
export class TitleBoxComponent {

  @Input() title: string = '';



}
