import {ChangeDetectorRef, Component, inject, OnInit, ViewChild} from '@angular/core';
import {QuillEditorComponent} from "ngx-quill";
import {FormBuilder, FormGroup} from "@angular/forms";
import {OptionModel} from "@core/models";
import {ValidatorUtil} from "@core/utils/validator.util";
import {NZ_MODAL_DATA, NzModalRef} from "ng-zorro-antd/modal";
import {FormUtil} from "@core/utils/form.util";
import {EmailTemplateDTO, SaveEmailTemplateRequest} from "../../../models";
import {EmailService} from "../../../state/service";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {NotificationService} from "@core/services/notification.service";
import {DomSanitizer} from "@angular/platform-browser";

@UntilDestroy()
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
    private emailService: EmailService,
    private notification: NotificationService,
    private sanitizer: DomSanitizer,
  ) {
    this.buildForm();
  }

  get mailTemplate(): EmailTemplateDTO {
    return this.modalData.emailTemplate;
  }

  contentPreviewHTML: any; // Dùng cho Quill
  isLoadingSave = false

  form: FormGroup;
  typeContentOption: OptionModel[] = [
    {label: "HTML", value: "HTML"},
    {label: "TEXT", value: "TEXT"},
  ];



  ngOnInit(): void {

    this.getDetailTemplate();
  }


  getDetailTemplate() {
    if (this.mailTemplate){
      this.emailService.getDetailTemplateById(this.mailTemplate.id)
        .pipe(untilDestroyed(this))
        .subscribe((item) => {
          this.form.patchValue(item.data);
        })
    }
  }


  saveTemplate() {
    FormUtil.validate(this.form);

    const formVal = this.form.getRawValue();
    console.log('formVal', formVal)
    this.isLoadingSave = true;

    const request: SaveEmailTemplateRequest = this.mailTemplate?.id ? {id: this.mailTemplate.id, ...formVal} : formVal;

    this.emailService.saveMailTemplate(request).pipe()
      .subscribe({
        next: (res) => {
          this.notification.open({
            type: 'success',
            content: res?.message || (this.mailTemplate.id ? 'Cập nhật email template thành công' : 'Thêm email template mới thành công')
          })
          this.isLoadingSave = false;
          this.modalRef.destroy(true);
        },
        error: ({error}) => {
          this.notification.open({
            type: 'error',
            content: error?.message || 'Thao tác thất bại'
          });
          this.isLoadingSave = false;
        }
      });

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

  onChangeTypeContent(type: 'HTML' | 'TEXT'){
    if(type == 'HTML'){
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
    this.form.markAsPristine(); // clear form error when cancel edit
    this.form.markAsUntouched(); // clear form error when cancel edit
  }

  closeModal(){
    this.modalRef.destroy();
  }

}
