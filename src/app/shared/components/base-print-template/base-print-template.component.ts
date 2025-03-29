import {
  Component,
  ElementRef,
  Input,
  OnChanges, OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { TemplateService } from '../../../core/services/template.service';
import mustache from 'mustache'

@Component({
  selector: 'app-base-print-template',
  templateUrl: './base-print-template.component.html'
})
export class BasePrintTemplateComponent implements OnChanges, OnInit {
  @Input() printData: any;
  @Input() templateName: string = '';
  @Input() rotation: 'vertical' | 'horizontal' = 'vertical';
  @Input() sizeLayout: 'a3' | 'a4' = 'a4';
  transferData: any;
  template: string;

  classWidth = 'w-[850px]';

  @ViewChild('iframe') iframe: ElementRef<HTMLIFrameElement>;

  constructor(private templateService: TemplateService) {}


  ngOnInit(){
    if (this.rotation == 'horizontal'){
      if (this.sizeLayout == 'a4'){
        this.classWidth = 'w-[1124px]';
      } else if (this.sizeLayout == 'a3'){
        this.classWidth = 'w-[1600px]';
      }
    } else if (this.rotation == 'vertical') {
      if (this.sizeLayout == 'a3'){
        this.classWidth = 'w-[1124px]';
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // if (changes.printData.currentValue) {

    const data = {
      ...this.printData
    };

    this.transferData = {
      data: data
    };
    this.render();
    // }
  }

  render() {
    if (this.transferData) {
      this.templateService.getFile(this.templateName).subscribe((data) => {
        this.template = mustache.render(data, this.transferData);
        let doc =
          this.iframe.nativeElement.contentDocument ||
          this.iframe.nativeElement.contentWindow;
        doc?.open();
        (doc as Document).write(this.template);
        doc?.close();
      });
    }
  }

  print() {
    let doc = this.iframe.nativeElement.contentWindow;
    doc?.print();
    // doc.print()
  }
}
