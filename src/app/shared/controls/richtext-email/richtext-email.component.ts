import {
  Component, ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output, TemplateRef, ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ModuleQuill } from '@core/constants';
import {QuillEditorComponent} from "ngx-quill";
import {DomSanitizer} from "@angular/platform-browser";
import {NzModalService} from "ng-zorro-antd/modal";

@Component({
  selector: 'app-richtext-email',
  templateUrl: './richtext-email.component.html',
  styleUrls: ['./richtext-email.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RichtextEmailComponent),
      multi: true
    }
  ]
})
export class RichtextEmailComponent implements ControlValueAccessor {
  @Input() placeholder = '';
  @Input() disabled = false;
  @Input() maxLength: number;
  @Input() rows: number = 1;
  @Output() enter = new EventEmitter<boolean>();
  @Input() extraTpl?: TemplateRef<any>;

  @ViewChild('quillEditor') quillEditorComponent!: QuillEditorComponent;
  @ViewChild('preview') preview!: TemplateRef<any>;
  @ViewChild('myIframe') iframeRef!: ElementRef;

  moduleQuill = ModuleQuill;
  contentPreviewHTML: any;

  constructor(
    private sanitizer: DomSanitizer,
    private modal: NzModalService,
  ) {}

  value!: string;

  _onChange!: (_: any) => void;
  _onTouched!: (_: any) => void;

  onChange(event: any): void {
    if (event === '') {
      event = null;
      this.value = event;
    }
    // if (this._onChange) {
    //
    // }
    this._onChange(event);
    this.contentPreviewHTML = this.sanitizer.bypassSecurityTrustHtml(event || '');
  }

  writeValue(obj: any): void {
    this.value = obj;
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }



  insertPlaceholder(text: string) {
    const editor = this.quillEditorComponent?.quillEditor;
    const selection = editor?.getSelection(true);

    if (selection) {
      editor.insertText(selection.index, text);
      // @ts-ignore
      editor.setSelection(selection.index + text.length);
    }
  }

  showPreview(){
    this.modal.create({
      nzTitle: 'Xem trước nội dung email',
      nzWrapClassName: 'previewEmail',
      nzContent: this.preview,
      nzFooter: null,
      nzWidth: 900
    });
  }

}
