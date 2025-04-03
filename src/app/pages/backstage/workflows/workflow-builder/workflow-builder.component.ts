import { Component, OnInit } from '@angular/core';
import Drawflow from 'drawflow';

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

  tags = [
    { id: 101, name: 'Khách VIP' },
    { id: 202, name: 'Khách mới' },
    { id: 303, name: 'Đã mua hàng' }
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

  showPreviewButton = true;
  showStepModal = false;
  selectedStepId = '';
  selectedStepType = '';
  stepConfigValue: any = '';

  emailTemplates = [
    { id: 1, name: 'Chào mừng' },
    { id: 2, name: 'Giới thiệu sản phẩm' }
  ];

  sequences = [
    { id: 7, name: 'Chuỗi chăm sóc 7 ngày' },
    { id: 30, name: 'Chuỗi tương tác 30 ngày' }
  ];


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
   // this.selectedTriggerType = null;
    localStorage.setItem('workflow_triggers', JSON.stringify(this.triggerConditions));
  }

  editTrigger(index: number) {
    this.editIndex = index;
    this.newTrigger = JSON.parse(JSON.stringify(this.triggerConditions[index]));
  }

  removeTrigger(index: number) {
    this.triggerConditions.splice(index, 1);
    localStorage.setItem('workflow_triggers', JSON.stringify(this.triggerConditions));
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
    if (this.triggerConditions.length === 0) {
      alert('Bạn cần thêm ít nhất 1 điều kiện');
      return;
    }
    this.tab = 2;
    //save
    localStorage.setItem('workflow_triggers', JSON.stringify(this.triggerConditions));

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


  addNode(type: string) {
    const id = type + '_' + new Date().getTime();
    const data = { label: type };
    const html = `<div class='node hoverable' id='${id}' data-node-id='${id}'>${type}</div>`;

    this.editor.addNode(
      type,
      1,
      1,
      100 + Math.floor(Math.random() * 400),
      100 + Math.floor(Math.random() * 200),
      type,
      data,
      html
    );

    // Add highlight + open modal behavior
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('click', () => {
          document.querySelectorAll('.node').forEach(n => n.classList.remove('selected'));
          el.classList.add('selected');
          this.openStepModal(id, type);
        });
      }
    }, 100);
  }


  getLabelForStep(type: string, value: any): string {
    if (type === 'SEND_EMAIL') {
      const email = this.emailTemplates.find(t => t.id == value);
      return email ? email.name : `ID ${value}`;
    }
    if (type === 'ADD_TAG' || type === 'REMOVE_TAG') {
      const tag = this.tags.find(t => t.id == value);
      return tag ? tag.name : `Tag #${value}`;
    }
    if (type === 'ADD_TO_SEQUENCE') {
      const seq = this.sequences.find(s => s.id == value);
      return seq ? seq.name : `Sequence #${value}`;
    }
    if (type === 'WAIT') {
      return `${value} ngày`;
    }
    return value;
  }

  previewJSON() {
    const json = {
      triggers: this.triggerConditions,
      flow: this.editor?.export() || {}
    };
    alert(JSON.stringify(json, null, 2));
  }

  openStepModal(id: string, type: string) {
    this.selectedStepId = id;
    this.selectedStepType = type;
    this.stepConfigValue = '';
    this.showStepModal = true;
  }

  closeStepModal() {
    this.showStepModal = false;
    this.selectedStepId = '';
    this.selectedStepType = '';
    this.stepConfigValue = '';
  }

  confirmStepConfig() {
    const nodeId = this.selectedStepId.split('_')[1];
    const nodeData = this.editor.getNodeFromId(nodeId);
    if (nodeData) {
      nodeData.data.config = this.stepConfigValue;

      // Cập nhật lại label hiển thị trên canvas
      const displayText = `${this.selectedStepType}: ${this.getLabelForStep(this.selectedStepType, this.stepConfigValue)}`;
      const el = document.getElementById(this.selectedStepId);
      if (el) {
        el.innerText = displayText;
      }
    }
    this.closeStepModal();
  }


}
