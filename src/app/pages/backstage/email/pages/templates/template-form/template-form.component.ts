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
  ) {
    this.buildForm();
  }

  sampleHTML = '<!DOCTYPE html><html lang="vi"><head><meta charset="UTF-8"><title>Hành trình nối liền hai miền đất nước</title><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body style="margin:0; padding:0; background-color:#f5f5f5; font-family: Arial, sans-serif; color: #515151;"><table width="100%" cellpadding="0" cellspacing="0" bgcolor="#f5f5f5"><tr><td align="center"><table width="600" cellpadding="0" cellspacing="0" bgcolor="#ffffff" style="margin: 20px auto; border-radius: 8px; overflow: hidden;"><tr><td style="padding: 30px;"><p style="font-size: 16px;">{{subscriber.first_name}} thân mến!</p><p>Ngày 30/4 không chỉ là một cột mốc lịch sử. Đó là một tiếng gọi từ quá khứ – vang lên đầy xúc động giữa lòng hiện tại.</p><p>Gần nửa thế kỷ đã trôi qua, nhưng hình ảnh đoàn quân tiến vào Dinh Độc Lập giữa trưa nắng Sài Gòn vẫn sống mãi trong ký ức dân tộc – như một biểu tượng không thể phai về khát vọng thống nhất, tự do.</p><p>Có những người ra đi mãi mãi không về. Có những người trở về với vết thương không thể nhìn thấy. Có những người mang trong tim một lý tưởng lớn hơn chính họ – đó là giấc mơ về một Việt Nam hòa bình, độc lập, đoàn kết.</p><p>Và chính họ – những người lính, những bà mẹ, những thanh niên xung phong, những người dân thường âm thầm góp sức – đã viết nên bản anh hùng ca vĩ đại của dân tộc.</p><p>Hôm nay, chúng ta được sống trong hòa bình, học tập, lao động, khởi nghiệp… chính là nhờ họ đã từng đánh đổi tuổi trẻ, giấc mơ, thậm chí là mạng sống – để thế hệ sau được tự do lựa chọn con đường đi của chính mình.</p><p>Chiến thắng 30/4 là lời nhắc về sự biết ơn.<br> Là lời gọi về trách nhiệm tiếp nối.<br> Là cơ hội để mỗi người tự hỏi: <em>Mình đang sống thế nào cho xứng đáng với những điều đã được trao?</em></p><p>Trong thời đại mới, “tự do” không chỉ là không còn tiếng súng.<br> Tự do là được chọn sống thật với mình.<br> Là được làm công việc mình yêu, theo cách mình tin.<br> Là dũng cảm bước tiếp hành trình của cha anh – trên mặt trận của tri thức, của sáng tạo, của lòng biết ơn.</p><p>Chúc bạn một ngày 30/4 thật lặng – để lắng nghe.<br> Thật sâu – để cảm nhận.<br> Và thật sống – để biết ơn.</p><div style="text-align: center; margin: 30px 0;"><a href="{{user.webinar_url}}" style="background-color: #df0609; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block;"> XEM LIVE TẠI ĐÂY </a></div><hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;"><p style="margin: 0 0 5px;">Nếu có bất kỳ thắc mắc nào trong quá trình tìm hiểu, mình luôn sẵn sàng hỗ trợ. <strong>Thông tin liên hệ:</strong></p><p style="margin: 0 0 5px;"><strong>{{user.business_name}}</strong></p><p style="margin: 0 0 5px;">Zalo: <a href="https://zalo.me/{{user.phone}}" target="_blank">{{user.phone}}</a></p><p style="margin: 0;">Facebook: <a href="{{user.facebook_url}}" target="_blank">{{user.facebook_url}}</a></p></td></tr><tr><td bgcolor="#f0f0f0" style="padding: 20px; text-align: center; font-size: 12px; color: #888;"> Nếu bạn không còn muốn nhận email từ <strong>{{user.business_name}}</strong>, bạn có thể <a href="{{unsubscribe_link}}" style="color:#0000ee; text-decoration: underline;">huỷ đăng ký tại đây</a>. <br>Chúng tôi luôn tôn trọng quyết định của bạn. </td></tr></table></td></tr></table></body></html>'

  get mailTemplate(): EmailTemplateDTO {
    return this.modalData.emailTemplate;
  }

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
