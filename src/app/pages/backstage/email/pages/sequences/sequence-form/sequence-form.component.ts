import {ChangeDetectorRef, Component, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {QuillEditorComponent} from "ngx-quill";
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {ValidatorUtil} from "@core/utils/validator.util";
import {DATE_TIME_FORMAT} from "@core/constants";
import {NZ_MODAL_DATA, NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {FormUtil} from "@core/utils/form.util";
import {
  EmailTemplateDTO, ReOrderStepsSequenceRequest, SaveCombineSequenceRequest,
  SaveSequenceRequest,
  SaveStepSequenceRequest,
  SequenceDTO,
  StepSequenceDTO
} from "../../../models";
import {EmailService} from "../../../state/service";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {NotificationService} from "@core/services/notification.service";
import { moveItemInArray } from '@angular/cdk/drag-drop';
import {Store} from "@ngrx/store";
import {OptionDelayDate, Status} from "@core/options";
import {CdkDragDrop} from "@angular/cdk/drag-drop";
import {SelectTemplateModalComponent} from "../../../components/select-template-modal/select-template-modal.component";
import {isEmpty} from "lodash";

@UntilDestroy()
@Component({
  selector: 'app-sequence-form',
  templateUrl: './sequence-form.component.html',
})
export class SequenceFormComponent implements OnInit, OnDestroy {
  @ViewChild('quillEditor') quillEditorComponent!: QuillEditorComponent;

  readonly modalData: {sequence: SequenceDTO} = inject(NZ_MODAL_DATA);

  modalSelectTemplateRef: NzModalRef;

  constructor(
    private fb: FormBuilder,
    private modalRef: NzModalRef,
    private cdr: ChangeDetectorRef,
    private store: Store,
    private modal: NzModalService,
    private emailService: EmailService,
    private notification: NotificationService,
  ) {
    this.buildForm();
  }

  crrStep = 0; // danh sách step là formArray, nhưng khi edit chỉ hiện 1 item, nên sử dụng crrStep để check xem index nào trong formArray đang đc chọn để hiển thị item bằng đk: crrStep == index, nên khi xóa, thêm step, chỉ cần đổi value của crrStep là đc;
  optionDelayDate = OptionDelayDate;

  DATE_TIME_FORMAT = DATE_TIME_FORMAT;

  get sequence(): SequenceDTO {
    return this.modalData.sequence;
  }
  set sequence(sequence: SequenceDTO) {
    this.modalData.sequence = sequence;
  }

  isLoadingSave = false
  loadingDelStep = false

  form: FormGroup;
  formStep: FormGroup;



  ngOnInit(): void {

    if (this.sequence?.id) {
      this.getDetailSequence(this.sequence.id);
      this.getAllStepInSequence(this.sequence.id);
      // nếu sequence từ màn hình list có đủ data thì có thể ko cần gọi api get detail sequence mà patchValue luôn đc
      // this.form.patchValue({
      //     ...this.sequence,
      //     status: this.sequence.status == 'ACTIVE' ? true : false,
      //   });
    }
  }



  getDetailSequence(sequenceId: number) {
    if (this.sequence){
      this.emailService.getDetailSequenceById(sequenceId)
        .pipe(untilDestroyed(this))
        .subscribe((item) => {
          console.log('item', item)
          this.form.patchValue({
            ...item.data,
            status: item.data.status == 'ACTIVE' ? 1 : 0,
          });
        })
    }
  }


  getAllStepInSequence(sequenceId: number) {
    if (this.sequence){
      this.emailService.getAllStepInSequence(sequenceId)
        .pipe(untilDestroyed(this))
        .subscribe((item) => {
          if (!isEmpty(item)) {
            this.setValueSteps(item.data)
          }
        })
    }
  }


  setValueSteps(data: StepSequenceDTO[]){
    this.formStep = this.fb.group({
      steps: this.fb.array(data.map((item: StepSequenceDTO) => this.fb.group({
        id: [item.id],
        sequenceId: [item.sequenceId],
        templateId: [item.templateId],
        templateName: [],
        subject: [item.subject, [ValidatorUtil.required('Subject không được để trống')]],
        htmlBody: [item.htmlBody, [ValidatorUtil.required('Nội dung không được để trống')]],
        delayDays: [item.delayDays, [ValidatorUtil.required()]],
      })
      ))
    });
  }


  deleteStep(index: number) {

    const currentStepControl = this.steps?.at(index) as FormGroup;

    const currentStepValue = currentStepControl.getRawValue();
    if (currentStepValue.id){
      this.loadingDelStep = true;
      this.emailService.deleteStepSequence(currentStepValue.id).pipe()
        .subscribe({
          next: (res) => {
            this.notification.open({
              type: 'success',
              content: res?.message || 'Xóa step thành công'
            })
            this.loadingDelStep = false;

            this.steps.removeAt(index);
            if (this.steps.length > 0) {
              this.editStep(index != 0 ? index - 1 : 0);
            }
          },
          error: ({error}) => {
            this.notification.open({
              type: 'error',
              content: error?.message || 'Thao tác thất bại'
            });
            this.loadingDelStep = false;
          }
        });
    } else {
      this.steps.removeAt(index);
      if (this.steps.length > 0) {
        this.editStep(index - 1);
      }
    }


  }

  buildForm(){
    this.form = this.fb.group({
      name: [null, [ValidatorUtil.required('Tên sequence không được để trống!')]],
      description: [null],
      status: [0],
    });

    this.formStep = this.fb.group({
      steps: this.fb.array([]),
    })

  }

  editStep(index: number) {
    this.crrStep = index;
    this.cdr.detectChanges()
  }

  get steps() : FormArray {
    return this.formStep.get('steps') as FormArray;
  }


  saveCombineSequence(){
    FormUtil.validate(this.form, true);

    const formVal = this.form.getRawValue();

    const requestInfo = {
      ...formVal,
      status: formVal.status === Status.ACTIVE ? 'ACTIVE' : 'INACTIVE',
    }

    const requestSaveSequence: SaveSequenceRequest = this.sequence?.id ? {id: this.sequence.id, ...requestInfo} : requestInfo;

    let requestSaveStep: SaveStepSequenceRequest;
    let currentStepControl: FormGroup;
    let request: SaveCombineSequenceRequest = {
      info: requestSaveSequence,
    }

    if (this.steps.length != 0){
      currentStepControl = this.steps?.at(this.crrStep) as FormGroup;

      FormUtil.validate(currentStepControl, true);
      if (currentStepControl.invalid){ return }

      requestSaveStep = currentStepControl.getRawValue();
      request = {
        ...request,
        step: requestSaveStep,
      }
    }

    if (this.form.invalid){ return }

    this.isLoadingSave = true;


    this.emailService.saveCombineSequence(request).pipe()
      .subscribe({
        next: (res) => {

          this.notification.open({
            type: 'success',
            content: res.info?.message || (this.sequence?.id ? 'Cập nhật sequence thành công' : 'Thêm mới sequence thành công')
          });

          this.sequence = res.info.data;
          this.isLoadingSave = false;
          if (!requestSaveStep?.id && res.step?.data){
            currentStepControl.patchValue(res.step.data); // set id cho step trong formSteps để bỏ trạng thái DRAFT
          }

          // this.modalRef.destroy(true);
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

  addStep(){
    const totalSteps = this.steps.length;
    console.log('totalSteps', totalSteps)
    this.steps.insert(totalSteps, this.newStep());
    this.crrStep = totalSteps;
    this.cdr.detectChanges();
  }

  newStep(): FormGroup {
    return this.fb.group({
      id: [],
      sequenceId: [this.sequence?.id || null],
      templateId: [null],
      templateName: [null],
      subject: ['New step', [ValidatorUtil.required('Subject không được để trống')]],
      htmlBody: [null, [ValidatorUtil.required('Nội dung không được để trống')]],
      delayDays: [this.optionDelayDate[0].value, [ValidatorUtil.required()]],
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    const steps = [...this.steps.controls];
    moveItemInArray(steps, event.previousIndex, event.currentIndex);
    console.log('steps', steps)
    this.formStep.setControl('steps', this.fb.array(steps));
    this.crrStep = event.currentIndex;

    const stepIds: number[] = this.steps.getRawValue().map(item => item.id).filter(item => item);
    this.saveOrderSteps(stepIds);
    this.cdr.detectChanges();

  }

  saveOrderSteps(stepIds: number[]) {

    const request: ReOrderStepsSequenceRequest = {
      stepIds: stepIds,
      sequenceId: this.sequence.id,
    }
    this.emailService.saveOrderStepSequence(request)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res) => {
          this.notification.open({
            type: 'success',
            content: res?.message || 'Re-order steps successfully',
          })
        },
        error: ({error}) => {
          this.notification.open({
            type: 'error',
            content: error?.message || 'Re-order steps failed',
          });
        }
      });


  }

  closeModal(){
    this.modalRef.destroy();
  }

  openModalSelectTemplate(){
    this.modalSelectTemplateRef = this.modal.create({
      nzTitle: 'Danh sách template email',
      nzContent: SelectTemplateModalComponent,
      nzFooter: null,
      nzWidth: '1100px',
      nzMaskClosable: false
    });

    this.cdr.detectChanges();

    this.modalSelectTemplateRef.afterClose.subscribe((templates: EmailTemplateDTO[]) => {
      if(templates){
        let contentHTML = '';
        templates.map((item: EmailTemplateDTO) => {
          contentHTML = contentHTML + item.htmlBody
        });
        const currentStepControl = this.steps?.at(this.crrStep) as FormGroup;
        currentStepControl.patchValue({htmlBody: contentHTML})
      }
    });
  }

  ngOnDestroy() {
    if (this.modalSelectTemplateRef){
      this.modalSelectTemplateRef.destroy();
    }
  }

}
