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

  workflowName: string = '';
  errorMessage: string = '';

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
    const data = { label: type };
    this.editor.addNode(
      type,
      1,
      1,
      100 + Math.floor(Math.random() * 400),
      100 + Math.floor(Math.random() * 200),
      type,
      data,
      `<div class='node'>${type}</div>`
    );
  }

}
