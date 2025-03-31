import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {EmailTemplateDTO, EmailTemplateService} from '../../../data/email-template.service';
import {QuillEditorComponent} from "ngx-quill";
import {FormControl} from "@angular/forms";


@Component({
  selector: 'app-template-form',
  templateUrl: './template-form.component.html',
})
export class TemplateFormComponent implements OnInit {
  @ViewChild('quillEditor') quillEditorComponent!: QuillEditorComponent;

  insertPlaceholder(text: string) {
    const editor = this.quillEditorComponent?.quillEditor;
    const selection = editor?.getSelection(true);

    if (selection) {
      editor.insertText(selection.index, text);
      // @ts-ignore
      editor.setSelection(selection.index + text.length);
    }
  }

  contentControl = new FormControl(''); // Dùng cho Quill

  isEditMode = false;
  templateId!: number;
  previewMode = false;

  template: EmailTemplateDTO = {
    id: 0,
    name: '',
    subject: '',
    type: 'html',
    content: '',
    status: 'active',
    createdAt: '',
    updatedAt: ''
  };

  constructor(
    private router: Router,
    private templateService: EmailTemplateService
  ) {}

  ngOnInit(): void {
    // Nếu edit mode → gán nội dung vào form control
    if (this.isEditMode) {
      this.templateService.getTemplateById(this.templateId).subscribe(data => {
        if (data) {
          this.template = { ...data };
          this.contentControl.setValue(this.template.content);
        }
      });
    }
  }

  saveTemplate() {
    const convertedContent = this.convertContent(this.contentControl.value || '');
    const dataToSave = {
      ...this.template,
      content: convertedContent
    };

    if (this.isEditMode) {
      this.templateService.updateTemplate(this.templateId, dataToSave).subscribe(() => {
        alert('Cập nhật thành công!');
        this.router.navigate(['/templates']);
      });
    } else {
      this.templateService.createTemplate(dataToSave).subscribe(() => {
        alert('Tạo mới thành công!');
        this.router.navigate(['/templates']);
      });
    }
  }

  convertContent(content: string): string {
    if (this.template.type === 'html') {
      return content.replace(/{{\s*subscriber\.first_name\s*}}/g, '{{ contact.first_name }}');
    }
    return content;
  }
}
