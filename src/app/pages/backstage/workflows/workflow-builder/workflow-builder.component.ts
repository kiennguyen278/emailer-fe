import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import Drawflow from 'drawflow';
import {TriggerConditionDTO, WorkflowDTO, WorkflowStepDTO} from "../data/workflow.dto";
import {Store} from "@ngrx/store";
import {ActivatedRoute} from "@angular/router";
import {SubscribersService} from "../../subscribers/state/service";
import {NotificationService} from "@core/services/notification.service";
import {NzModalService} from "ng-zorro-antd/modal";
import {FormBuilder} from "@angular/forms";
import {NzMessageService} from "ng-zorro-antd/message";

@Component({
  selector: 'app-workflow-builder',
  templateUrl: './workflow-builder.component.html',
  styleUrls: ['./workflow-builder.component.less']
})
export class WorkflowBuilderComponent implements OnInit {
  tab = 1;
  editor: any;

  newTrigger = {
    conditionType: '',
    logicOperator: 'AND',
    value: {}
  };
  triggerConditions: any[] = [];
  editIndex: number | null = null;

  workflowName: string = '';
  errorMessage: string = '';

  emailTemplates = [
    { id: 1, name: 'Welcome Email' },
    { id: 2, name: 'Product Introduction' }
  ];

  tags = [
    { id: 101, name: 'Khách hàng mới' },
    { id: 102, name: 'Tiềm năng' }
  ];

  sequences = [
    { id: 201, name: 'Chuỗi onboarding' },
    { id: 202, name: 'Giữ chân khách hàng' }
  ];


  triggerTypes = [
    {
      value: 'TAG',
      label: 'Gán Tag',
      fields: [
        {
          key: 'tag_id',
          label: 'Chọn tag:',
          type: 'select',
          options: () => this.tags
        }
      ]
    },
    {
      value: 'SUBSCRIBED_BEFORE',
      label: 'Đăng ký trước ngày',
      fields: [
        {
          key: 'before_date',
          label: 'Trước ngày:',
          type: 'date'
        }
      ]
    },
    {
      value: 'INACTIVE_DAYS',
      label: 'Không hoạt động N ngày',
      fields: [
        {
          key: 'days',
          label: 'Số ngày không hoạt động:',
          type: 'number'
        }
      ]
    }
  ];

  constructor(
    private message: NzMessageService,
  ) {

  }

  ngOnInit(): void {
    const savedTriggers = localStorage.getItem('workflow_triggers');
    if (savedTriggers) {
      this.triggerConditions = JSON.parse(savedTriggers);
    }

  }

  get selectedTriggerType() {
    return this.triggerTypes.find(t => t.value === this.newTrigger.conditionType);
  }

  getFieldOptions(field: any): any[] {
    return typeof field.options === 'function' ? field.options() : [];
  }

  addOrUpdateTrigger() {
    if (!this.newTrigger.conditionType) return alert('Vui lòng chọn loại điều kiện.');
    if (this.newTrigger.conditionType === 'TAG' && !this.newTrigger.value['tag_id']) return alert('Vui lòng chọn tag.');
    if (this.newTrigger.conditionType === 'SUBSCRIBED_BEFORE' && !this.newTrigger.value['before_date']) return alert('Vui lòng chọn ngày.');

    if (this.editIndex !== null) {
      this.triggerConditions[this.editIndex] = { ...this.newTrigger };
      this.editIndex = null;
    } else {
      this.triggerConditions.push({ ...this.newTrigger });
    }
    this.newTrigger = { conditionType: '', logicOperator: 'AND', value: {} };

    //save
    this.saveToLocal();
  }

  editTrigger(index: number) {
    this.editIndex = index;
    this.newTrigger = JSON.parse(JSON.stringify(this.triggerConditions[index]));
  }

  removeTrigger(index: number) {
    this.triggerConditions.splice(index, 1);

    this.saveToLocal();
  }

  getTriggerLabel(trigger: any): string {
    switch (trigger.conditionType) {
      case 'TAG':
        const tag = this.tags.find(t => t.id === trigger.value['tag_id']);
        return tag ? `Tag: ${tag.name}` : `Tag: #${trigger.value['tag_id']}`;
      case 'SUBSCRIBED_BEFORE':
        return `Trước ngày ${trigger.value['before_date']}`;
      case 'INACTIVE_DAYS':
        return `Không hoạt động ${trigger.value['days']} ngày`;
      default:
        return trigger.conditionType;
    }
  }

  nextTab() {
    this.errorMessage = '';
    if (!this.workflowName || this.workflowName.trim() === '') {
      this.errorMessage = 'Vui lòng nhập tên workflow.';
      return;
    }

    if (this.triggerConditions.length === 0) {
      this.errorMessage = 'Vui lòng thêm ít nhất một điều kiện trigger.';
      return;
    }

    this.tab = 2;

    setTimeout(() => {
      const container = document.getElementById('drawflow');
      if (container && !this.editor) {
        this.editor = new Drawflow(container);
        this.editor.reroute = true;
        this.editor.start();
      }
    }, 0);
  }

  isTriggerValid(): boolean {
    if (!this.selectedTriggerType) return false;
    return this.selectedTriggerType.fields.every((field: any) => {
      return this.newTrigger.value[field.key] !== undefined && this.newTrigger.value[field.key] !== '';
    });
  }

  canProceedToNextTab(): boolean {
    return this.triggerConditions.length > 0;
  }

  isStepModalOpen = false;
  selectedStepType = '';
  stepData: any = {};


  addNode(type: string) {
    this.openStepModal(type);
  }
  openStepModal(type: string) {
    this.selectedStepType = type;
    this.stepData = {}; // reset data mỗi lần mở
    this.isStepModalOpen = true;
  }

  confirmAddStep() {
    const label = this.getStepLabel(this.selectedStepType, this.stepData);
    const data = {
      label,
      stepData: { ...this.stepData }
    };

    this.editor.addNode(
      this.selectedStepType,
      1,
      1,
      100 + Math.floor(Math.random() * 400),
      100 + Math.floor(Math.random() * 200),
      this.selectedStepType,
      data,
      `<div class='node'>${label}</div>`
    );

    this.isStepModalOpen = false;

    this.saveToLocal();
  }

  getStepLabel(type: string, data: any): string {
    switch (type) {
      case 'SEND_EMAIL':
        const email = this.emailTemplates.find(t => t.id === data.email_template_id);
        return `📧 ${email?.name || 'Email'}`;
      case 'WAIT':
        return `⏱️ Chờ ${data.days} ngày`;
      case 'ADD_TAG':
        const tag1 = this.tags.find(t => t.id === data.tag_id);
        return `➕ Tag: ${tag1?.name || 'tag'}`;
      case 'REMOVE_TAG':
        const tag2 = this.tags.find(t => t.id === data.tag_id);
        return `➖ Tag: ${tag2?.name || 'tag'}`;
      case 'ADD_TO_SEQUENCE':
        const seq = this.sequences.find(s => s.id === data.sequence_id);
        return `🔁 Chuỗi: ${seq?.name || 'sequence'}`;
      default:
        return type;
    }
  }

  submitWorkflow() {
    const dto = this.buildWorkflowDTO();
    console.log('🎯 WorkflowDTO:', dto);
    this.message.success("Tạo workflow thành công!");

    // call API
  }

  buildWorkflowDTO(): WorkflowDTO {
    const triggerConditions: TriggerConditionDTO[] = this.triggerConditions.map((c, index) => ({
      conditionType: c.conditionType,
      conditionData: JSON.stringify(c.value),
      logicOperator: c.logicOperator,
      position: index
    }));

    const exported = this.editor?.export();
    const steps: WorkflowStepDTO[] = Object.values(exported?.drawflow?.Home?.data || {}).map((node: any, index: number) => ({
      stepType: node.name,
      stepData: JSON.stringify(node.data.stepData || {}),
      position: index
    }));

    return {
      id: 0,
      userId: 1,
      name: this.workflowName,
      status: 'DRAFT',
      triggerConditions: triggerConditions,
      steps: steps
    };
  }


  saveToLocal() {
    const dto = this.buildWorkflowDTO();
    localStorage.setItem('workflow_data', JSON.stringify(dto));
  }

}
