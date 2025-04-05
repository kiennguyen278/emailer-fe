import {ChangeDetectorRef, Component, inject, OnInit, ViewChild} from '@angular/core';
import {QuillEditorComponent} from "ngx-quill";
import {FormBuilder, FormGroup} from "@angular/forms";
import {ColumnConfig, OptionModel, TableQueryParams} from "@core/models";
import {ValidatorUtil} from "@core/utils/validator.util";
import {DATE_TIME_FORMAT, ModuleQuill} from "@core/constants";
import {NZ_MODAL_DATA, NzModalRef} from "ng-zorro-antd/modal";
import {FormUtil} from "@core/utils/form.util";
import {EmailCampaignDTO, SaveEmailCampaignRequest, SaveEmailTemplateRequest} from "../../../models";
import {EmailService} from "../../../state/service";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {NotificationService} from "@core/services/notification.service";
import {Observable} from "rxjs";
import {
  selectDataGetSubscriberList,
  selectLoadingGetSubscriberList,
  selectOptionsTagsList,
  selectTotalItemsGetSubscriberList
} from "../../../../subscribers/state/selectors";
import {Store} from "@ngrx/store";
import {getListSubscribers, getListTags} from "../../../../subscribers/state/actions";
import {SubscriberDTO} from "../../../../subscribers/models";
import {isEmpty} from "lodash";
import {differenceInCalendarDays} from "date-fns";

@UntilDestroy()
@Component({
  selector: 'app-campaign-form',
  templateUrl: './campaign-form.component.html',
})
export class CampaignFormComponent implements OnInit {
  @ViewChild('quillEditor') quillEditorComponent!: QuillEditorComponent;

  readonly modalData: {emailCampaign: EmailCampaignDTO} = inject(NZ_MODAL_DATA);


  tagOptions$: Observable<OptionModel<number>[]> = this.store.select(selectOptionsTagsList); // làm option select ở addnew/edit Subscriber
  loadingGetSubscriber$: Observable<boolean> = this.store.select(selectLoadingGetSubscriberList);

  constructor(
    private fb: FormBuilder,
    private modalRef: NzModalRef,
    private cdr: ChangeDetectorRef,
    private store: Store,
    private emailService: EmailService,
    private notification: NotificationService,
  ) {
    this.buildForm();
  }

  disabledDate = (current: Date): boolean => (differenceInCalendarDays(current, new Date()) < 0);


  itemsSubscriber: SubscriberDTO[] = [];
  columnsSubscriber: ColumnConfig[] = [
    {
      key: 'email',
      header: 'Email',
      tdClass: 'text-center',
      nzWidth: '200px',
    },

    {
      key: 'firstName',
      header: 'Name',
      tdClass: 'text-center',
      nzWidth: '150px',
    },
    {
      key: 'status',
      header: 'Trạng thái',
      nzWidth: '100px',
      tdClass: 'text-center',
    },
  ];
  paginationSubscriber = {index: 1, size: 30, total: 0};

  selectedKeys: number[] | string[] = [];


  DATE_TIME_FORMAT = DATE_TIME_FORMAT;

  get emailCampaign(): EmailCampaignDTO {
    return this.modalData.emailCampaign;
  }

  contentPreviewHTML= ''; // Dùng cho Quill
  showPreview = false;
  moduleQuill = ModuleQuill;
  isLoadingSave = false

  form: FormGroup;



  ngOnInit(): void {
    this.store.dispatch(getListTags());

    this.getSubscriberList();
    this.selectSubscribeStore();
  }


  selectSubscribeStore(){
    this.store.select(selectTotalItemsGetSubscriberList)
      .pipe(untilDestroyed(this))
      .subscribe((total) => (this.paginationSubscriber = { ...this.paginationSubscriber, total }));

    this.store.select(selectDataGetSubscriberList)
      .pipe(untilDestroyed(this))
      .subscribe((items) => {
        this.itemsSubscriber = items;
        this.cdr.detectChanges();
      });
  }


  getSubscriberList() {
    const request = {page: this.paginationSubscriber.index, size: this.paginationSubscriber.size};
    this.store.dispatch(getListSubscribers({payload: request}))
  }


  getDetailCampaign() {
    if (this.emailCampaign){
      this.emailService.getDetailCampaignsById(this.emailCampaign.id)
        .pipe(untilDestroyed(this))
        .subscribe((item) => {
          this.form.patchValue(item.data);
        })
    }
  }


  onSelectKeysChange(keys: string[] | number[]){
    console.log(keys);
    this.selectedKeys = keys;
    this.form.patchValue({subscriberIds: keys});
  }

  onQueryParams(params: TableQueryParams) {
    if (params.pageIndex){
      this.paginationSubscriber.index = params.pageIndex;
    }
    if (params.pageSize){
      this.paginationSubscriber.size = params.pageSize;
    }
    this.getSubscriberList();
  }

  saveCampaign() {
    const formVal = this.form.getRawValue();

    FormUtil.validate(this.form);

    // if (isEmpty(formVal.subscriberIds)){
    //   this.notification.open({
    //     type: 'error',
    //     content: 'Vui lòng chọn danh sách Subscriber cho campaign'
    //   });
    //   return;
    // }

    console.log('formVal', formVal)
    this.isLoadingSave = true;

    const request: SaveEmailCampaignRequest = this.emailCampaign?.id ? {id: this.emailCampaign.id, ...formVal} : formVal;

    this.emailService.saveMailCampaign(request).pipe()
      .subscribe({
        next: () => {
          this.notification.open({
            type: 'success',
            content: this.emailCampaign?.id ? 'Cập nhật campaign thành công' : 'Thêm campaign mới thành công'
          })
          this.isLoadingSave = false;
          this.modalRef.destroy(true);
        },
        error: (err) => {
          console.log('err', err);
          this.notification.open({
            type: 'error',
            content: 'Thao tác thất bại'
          });
          this.isLoadingSave = false;
        }
      });

  }

  buildForm(){
    this.form = this.fb.group({
      name: [null, [ValidatorUtil.required('Tên campaign không được để trống!')]],
      subject: [null, [ValidatorUtil.required('Subject không được để trống!')]],
      description: [null],
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
