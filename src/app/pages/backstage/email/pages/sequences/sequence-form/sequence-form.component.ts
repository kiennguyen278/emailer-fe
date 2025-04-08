import {ChangeDetectorRef, Component, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {QuillEditorComponent} from "ngx-quill";
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {ValidatorUtil} from "@core/utils/validator.util";
import {DATE_TIME_FORMAT} from "@core/constants";
import {NZ_MODAL_DATA, NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {FormUtil} from "@core/utils/form.util";
import {
  EmailTemplateDTO, ReOrderStepsSequenceRequest,
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
import {TemplateFormComponent} from "../../templates/template-form/template-form.component";
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

  crrStep = 0;
  optionDelayDate = OptionDelayDate;
  selectedTabIndex = 0;


  DATE_TIME_FORMAT = DATE_TIME_FORMAT;

  get sequence(): SequenceDTO {
    return this.modalData.sequence;
  }
  set sequence(sequence: SequenceDTO) {
    this.modalData.sequence = sequence;
  }

  isLoadingSave = false

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


  saveSequence() {
    const formVal = this.form.getRawValue();

    FormUtil.validate(this.form);

    this.isLoadingSave = true;

    const request = {
      ...formVal,
      status: formVal.status === Status.ACTIVE ? 'ACTIVE' : 'INACTIVE',
    }

    const request2: SaveSequenceRequest = this.sequence?.id ? {id: this.sequence.id, ...request} : request;

    this.emailService.saveSequence(request2).pipe()
      .subscribe({
        next: (res) => {
          this.notification.open({
            type: 'success',
            content: res?.message || (this.sequence?.id ? 'Cập nhật sequence thành công' : 'Thêm sequence mới thành công')
          })
          this.isLoadingSave = false;
          console.log('res', res);
          if (!this.sequence?.id){
            this.onTabChange({index: 1});
            this.sequence = res.data;
          } else {
            // this.modalRef.destroy(true);
          }
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
      name: [null, [ValidatorUtil.required('Tên sequence không được để trống!')]],
      description: [null],
      status: [1],
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


  saveStepSequence(){
    const currentStepControl = this.steps?.at(this.crrStep) as FormGroup;
    console.log('currentStepControl', currentStepControl.getRawValue())
    if (currentStepControl.invalid){
      this.steps?.at(this.crrStep).markAllAsTouched();
      this.steps?.at(this.crrStep).markAsPristine();
      return
    }

    const stepSequenceValue: SaveStepSequenceRequest = currentStepControl.getRawValue();

    this.emailService.saveStepSequence(stepSequenceValue).pipe()
      .subscribe({
        next: (res) => {
          this.notification.open({
            type: 'success',
            content: res?.message || (stepSequenceValue?.id ? 'Cập nhật step sequence thành công' : 'Thêm step sequence mới thành công')
          })
          this.isLoadingSave = false;
          if (!stepSequenceValue?.id){
            currentStepControl.patchValue(res.data); // set id cho step trong formSteps để bỏ trạng thái DRAFT
          }

          // this.modalRef.destroy(true);
        },
        error: ({error}) => {
          console.log('err saveStepSequence ===>', error);
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
      sequenceId: [this.sequence.id],
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

  onTabChange(e: any): void {
    this.selectedTabIndex = e.index;
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
