import {ChangeDetectorRef, Component, inject, OnInit, ViewChild} from '@angular/core';
import {QuillEditorComponent} from "ngx-quill";
import {FormBuilder, FormGroup} from "@angular/forms";
import {OptionModel, TableQueryParams} from "@core/models";
import {ValidatorUtil} from "@core/utils/validator.util";
import {DATE_TIME_FORMAT} from "@core/constants";
import {NZ_MODAL_DATA, NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {FormUtil} from "@core/utils/form.util";
import {EmailCampaignDTO, EmailTemplateDTO, SaveEmailCampaignRequest} from "../../../models";
import {EmailService} from "../../../state/service";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {NotificationService} from "@core/services/notification.service";
import {Observable} from "rxjs";
import {
  selectDataGetSubscriberList,
  selectOptionsTagsList,
  selectTotalItemsGetSubscriberList
} from "../../../../subscribers/state/selectors";
import {Store} from "@ngrx/store";
import {getListSubscribers, getListTags} from "../../../../subscribers/state/actions";
import {SubscriberDTO} from "../../../../subscribers/models";
import {differenceInCalendarDays} from "date-fns";
import {SelectTemplateModalComponent} from "../../../components/select-template-modal/select-template-modal.component";

@UntilDestroy()
@Component({
  selector: 'app-campaign-form',
  templateUrl: './campaign-form.component.html',
})
export class CampaignFormComponent implements OnInit {
  @ViewChild('quillEditor') quillEditorComponent!: QuillEditorComponent;

  readonly modalData: {emailCampaign: EmailCampaignDTO} = inject(NZ_MODAL_DATA);

  modalSelectTemplateRef: NzModalRef;

  tagOptions$: Observable<OptionModel<number>[]> = this.store.select(selectOptionsTagsList); // làm option select ở addnew/edit Subscriber

  constructor(
    private fb: FormBuilder,
    private modalRef: NzModalRef,
    private cdr: ChangeDetectorRef,
    private store: Store,
    private emailService: EmailService,
    private modal: NzModalService,
    private notification: NotificationService,
  ) {
    this.buildForm();
  }

  disabledDate = (current: Date): boolean => (differenceInCalendarDays(current, new Date()) < 0);

  DATE_TIME_FORMAT = DATE_TIME_FORMAT;

  get emailCampaign(): EmailCampaignDTO {
    return this.modalData.emailCampaign;
  }

  isLoadingSave = false

  form: FormGroup;



  ngOnInit(): void {
    console.log(this.emailCampaign)
    this.store.dispatch(getListTags());

    if (this.emailCampaign) {
      this.getDetailCampaign(this.emailCampaign.id)
    }
  }



  getDetailCampaign(id: number) {
    if (this.emailCampaign){
      this.emailService.getDetailCampaignsById(id)
        .pipe(untilDestroyed(this))
        .subscribe((item) => {
          this.form.patchValue(item.data);
        })
    }
  }


  openModalSelectTemplate(){
    this.modalSelectTemplateRef = this.modal.create({
      nzTitle: 'Danh sách template email',
      nzContent: SelectTemplateModalComponent,
      nzFooter: null,
      nzWidth: '1100px',
      nzMaskClosable: false
    });

    this.modalSelectTemplateRef.afterClose.subscribe((templates: EmailTemplateDTO[]) => {
      if(templates){
        let contentHTML = '';
        templates.map((item: EmailTemplateDTO) => {
          contentHTML = contentHTML + item.htmlBody
        });
        this.form.patchValue({htmlBody: contentHTML})
      }
    });
  }

  saveCampaign() {
    const formVal = this.form.getRawValue();

    FormUtil.validate(this.form);

    this.isLoadingSave = true;

    const request: SaveEmailCampaignRequest = this.emailCampaign?.id ? {id: this.emailCampaign.id, ...formVal} : formVal;

    this.emailService.saveMailCampaign(request).pipe()
      .subscribe({
        next: (res) => {
          this.notification.open({
            type: 'success',
            content: res?.message || (this.emailCampaign?.id ? 'Cập nhật campaign thành công' : 'Thêm campaign mới thành công')
          })
          this.isLoadingSave = false;
          this.modalRef.destroy(true);
        },
        error: ({error}) => {
          this.notification.open({
            type: 'error',
            content: error?.message ||'Thao tác thất bại'
          });
          this.isLoadingSave = false;
        }
      });

  }

  buildForm(){
    this.form = this.fb.group({
      name: [null, [ValidatorUtil.required('Tên campaign không được để trống!')]],
      subject: [null, [ValidatorUtil.required('Subject không được để trống!')]],
      // description: [null],
      scheduledTime: [null, [ValidatorUtil.required('Scheduled Time không được để trống!')]],
      tagIds: [null, [ValidatorUtil.required('Tag không được để trống!')]],
      // subscriberIds: [null],
      htmlBody: [null, [ValidatorUtil.required('Nội dung không được để trống!')]],
    })
  }


  closeModal(){
    this.modalRef.destroy();
  }



}
