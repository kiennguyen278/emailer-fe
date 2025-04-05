import {ChangeDetectorRef, Component, inject, OnInit, ViewChild} from '@angular/core';
import {QuillEditorComponent} from "ngx-quill";
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {ColumnConfig, OptionModel, TableQueryParams} from "@core/models";
import {ValidatorUtil} from "@core/utils/validator.util";
import {DATE_TIME_FORMAT, ModuleQuill} from "@core/constants";
import {NZ_MODAL_DATA, NzModalRef} from "ng-zorro-antd/modal";
import {FormUtil} from "@core/utils/form.util";
import {SaveSequenceRequest, SaveStepSequenceRequest, SequenceDTO} from "../../../models";
import {EmailService} from "../../../state/service";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {NotificationService} from "@core/services/notification.service";
import { moveItemInArray } from '@angular/cdk/drag-drop';
import {Store} from "@ngrx/store";
import {OptionDelayDate, Status} from "@core/options";
import {CdkDragDrop} from "@angular/cdk/drag-drop";

@UntilDestroy()
@Component({
  selector: 'app-sequence-form',
  templateUrl: './sequence-form.component.html',
})
export class SequenceFormComponent implements OnInit {
  @ViewChild('quillEditor') quillEditorComponent!: QuillEditorComponent;

  readonly modalData: {sequence: SequenceDTO} = inject(NZ_MODAL_DATA);


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

  }



  getDetailCampaign() {
    if (this.sequence){
      this.emailService.getDetailCampaignsById(this.sequence.id)
        .pipe(untilDestroyed(this))
        .subscribe((item) => {
          this.form.patchValue(item.data);
        })
    }
  }


  saveSequence() {
    const formVal = this.form.getRawValue();

    FormUtil.validate(this.form);

    console.log('formVal', formVal)
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
            this.modalRef.destroy(true);
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
            content: res.message || stepSequenceValue?.id ? 'Cập nhật step sequence thành công' : 'Thêm step sequence mới thành công'
          })
          this.isLoadingSave = false;
          this.modalRef.destroy(true);
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
    this.cdr.detectChanges();

  }

  closeModal(){
    this.modalRef.destroy();
  }

  onTabChange(e: any): void {
    this.selectedTabIndex = e.index;
  }

}
