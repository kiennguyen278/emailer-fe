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
import {NotificationService} from "@core/services/notification.service";

@Component({
  selector: 'app-richtext-tinymce',
  templateUrl: './richtext-tinymce.component.html',
  styleUrls: ['./richtext-tinymce.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RichtextTinymceComponent),
      multi: true
    }
  ]
})
export class RichtextTinymceComponent implements ControlValueAccessor {
  @Input() placeholder = '';
  @Input() disabled = false;
  @Input() maxLength: number;
  @Input() rows: number = 1;
  @Output() enter = new EventEmitter<boolean>();
  @Input() extraTpl?: TemplateRef<any>;

  @ViewChild('preview') preview!: TemplateRef<any>;
  @ViewChild('myIframe') iframeRef!: ElementRef;

  contentPreviewHTML: any;
  editorInstance: any;

  constructor(
    private sanitizer: DomSanitizer,
    private modal: NzModalService,
    private notification: NotificationService,
  ) {}

  value!: string;

  _onChange!: (_: any) => void;
  _onTouched!: (_: any) => void;

  tinyConfig = {
    base_url: '/tinymce', // 👈 dòng này là bắt buộc
    suffix: '.min',       // 👈 dùng file tinymce.min.js
    height: 900,
    menubar: true,
    plugins: [
      'advlist',          // Danh sách nâng cao (số thứ tự/bullet)
      'autolink',         // Tự động chuyển link thành thẻ <a>
      'lists',            // Hỗ trợ danh sách
      'link',             // Chèn liên kết
      'image',            // Chèn hình ảnh
      'charmap',          // Ký tự đặc biệt
      'preview',          // Xem trước
      'anchor',           // Đánh dấu anchor
      'searchreplace',    // Tìm kiếm & thay thế
      'visualblocks',     // Hiển thị khối HTML
      'code',             // Xem/sửa HTML
      'fullscreen',       // Chuyển sang toàn màn hình
      'insertdatetime',   // Chèn ngày/giờ
      'media',            // Chèn media (video/audio)
      'table',            // Chèn bảng
      'paste',            // Quản lý paste
      'help',             // Hỗ trợ
      'wordcount'         // Đếm từ
    ],
    toolbar: 'undo redo | blocks | bold italic underline strikethrough | \
           forecolor backcolor | alignleft aligncenter alignright alignjustify | \
           bullist numlist outdent indent | link image media table | \
           removeformat | code fullscreen preview | help',
    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
    setup: (editor: any) => {
      this.editorInstance = editor;

      // Tạo custom button chèn nội dung
      editor.ui.registry.addButton('mybutton', {
        text: 'Chèn đoạn',
        onAction: () => {
          editor.insertContent('<strong>[Đoạn chèn vào]</strong>');
        }
      });
    }
  }

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
    this.contentPreviewHTML = this.sanitizer.bypassSecurityTrustHtml(this.value);
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
    if (this.editorInstance) {
      this.editorInstance.insertContent(text);
    }
  }

  showPreview(){
    if (!this.contentPreviewHTML || !this.contentPreviewHTML?.changingThisBreaksApplicationSecurity) {
      this.notification.open({
        type: 'info',
        content: 'Nội dung xem trước hiện đang trống!'
      });
      return;
    }

    this.modal.create({
      nzTitle: 'Xem trước nội dung email',
      nzWrapClassName: 'previewEmail',
      nzContent: this.preview,
      nzFooter: null,
      nzWidth: 900
    });
  }

}
