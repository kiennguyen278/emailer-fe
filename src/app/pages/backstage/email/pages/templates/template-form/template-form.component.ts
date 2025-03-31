import {ChangeDetectorRef, Component, inject, OnInit, ViewChild} from '@angular/core';
import {QuillEditorComponent} from "ngx-quill";
import {FormBuilder, FormGroup} from "@angular/forms";
import {OptionModel} from "@core/models";
import {ValidatorUtil} from "@core/utils/validator.util";
import {ModuleQuill} from "@core/constants";
import {NZ_MODAL_DATA, NzModalRef} from "ng-zorro-antd/modal";
import {FormUtil} from "@core/utils/form.util";
import {EmailTemplateDTO} from "../../../models";


@Component({
  selector: 'app-template-form',
  templateUrl: './template-form.component.html',
})
export class TemplateFormComponent implements OnInit {
  @ViewChild('quillEditor') quillEditorComponent!: QuillEditorComponent;

  readonly modalData: {emailTemplate: EmailTemplateDTO} = inject(NZ_MODAL_DATA);

  constructor(
    private fb: FormBuilder,
    private modalRef: NzModalRef,
    private cdr: ChangeDetectorRef,
  ) {
    this.buildForm();
  }

  contentPreviewHTML= ''; // Dùng cho Quill
  previewMode = true;
  moduleQuill = ModuleQuill;
  isLoadingSave = false

  form: FormGroup;
  typeContentOption: OptionModel[] = [
    {label: "HTML", value: "html"},
    {label: "Text", value: "text"},
  ];



  ngOnInit(): void {

    console.log('modalData', this.modalData.emailTemplate)
  }

  saveTemplate() {
    FormUtil.validate(this.form);

    const formVal = this.form.getRawValue();
    console.log('formVal', formVal)



  }

  buildForm(){
    this.form = this.fb.group({
      name: [null, [ValidatorUtil.required('Email không được để trống!')]],
      type: [this.typeContentOption[0].value, [ValidatorUtil.required('Type content không được để trống!')]],
      subject: [null, [ValidatorUtil.required('Subject không được để trống!')]],
      htmlBody: [null, [ValidatorUtil.required('Nội dung không được để trống!')]],
      textBody: [null],
    })
  }

  onChangeTypeContent(type: 'html' | 'text'){
    if(type == 'html'){
      this.form.controls['textBody'].reset();
      this.form.controls['textBody'].clearValidators();
      this.form.controls['htmlBody'].addValidators([ValidatorUtil.required('Content không được để trống!')]);
      this.form.controls['htmlBody'].updateValueAndValidity();
    } else {
      this.form.controls['htmlBody'].reset();
      this.form.controls['htmlBody'].clearValidators();
      this.form.controls['textBody'].addValidators([ValidatorUtil.required('Content không được để trống!')]);
      this.form.controls['textBody'].updateValueAndValidity();
    }
    this.cdr.detectChanges();
  }

  closeModal(){
    this.modalRef.destroy(true);
  }

  onChangeContent(content: string) {
    let result = content;
    if (this.form.controls['type'].value === 'html') {
      result = content && content.replace(/{{\s*subscriber\.first_name\s*}}/g, '{{ contact.first_name }}');
    }
    this.contentPreviewHTML = result || '';
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

}
