import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import Drawflow from 'drawflow';
import {TriggerConditionDTO, WorkflowDTO, WorkflowStepDTO} from "../data/workflow.dto";
import {NzMessageService} from "ng-zorro-antd/message";
import {WorkflowService} from "../data/workflow.service";
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import {omit} from "lodash";

@Component({
  selector: 'app-workflow-builder',
  templateUrl: './workflow-builder.component.html',
  styleUrls: ['./workflow-builder.component.less']
})
export class WorkflowBuilderComponent implements OnInit {

  @ViewChild('drawflowEl') drawflowEl!: ElementRef;

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

  tags: { id: number; name: string }[] = [];
  emailTemplates: { id: number; name: string }[] = [];
  sequences: { id: number; name: string }[] = [];

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


  isStepModalOpen = false;
  selectedStepType = '';
  stepData: any = {};


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private message: NzMessageService,
    private workflowService: WorkflowService,
    private cdr: ChangeDetectorRef,
  ) {

  }

  workflowId: number | null = null;

  ngOnInit(): void {
    this.workflowId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadWorkflowData();

    if (this.workflowId) {
      this.workflowService.getWorkflowDetail(this.workflowId).subscribe({
        next: (res) => {
          if (res.success && res.data) {
            localStorage.setItem('workflow_draft', JSON.stringify(res.data));
            this.loadFromLocalStorage(); // 🔁 bước build lại trigger và step
          }
        },
        error: () => {
          console.error('❌ Lỗi khi load workflow');
        }
      });
    } else {
      // với trường hợp tạo mới
      this.resetWorkflow();
    }
  }

  loadFromLocalStorage(): void {
    const saved = localStorage.getItem('workflow_draft');
    if (!saved) return;

    const wf: WorkflowDTO = JSON.parse(saved);

    this.workflowName = wf.name;
    this.triggerConditions = wf.triggerConditions.map(tc => ({
      conditionType: tc.conditionType,
      value: JSON.parse(tc.conditionData),
      logicOperator: tc.logicOperator
    }));
  }

  loadWorkflowData(): void {
    this.workflowService.getAllTags().subscribe({
      next: (res) => {
        this.tags = res.success ? res.data : [];
      },
      error: () => {
        this.tags = [];
      }
    });

    this.workflowService.getEmailTemplates().subscribe({
      next: (res) => {
        this.emailTemplates = res.success ? res.data : [];
      },
      error: () => {
        this.emailTemplates = [];
      }
    });

    this.workflowService.getEmailSequences().subscribe({
      next: (res) => {
        this.sequences = res.success ? res.data : [];
      },
      error: () => {
        this.sequences = [];
      }
    });
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


  buildTreeWorkflow(): void {
    const saved = localStorage.getItem('workflow_draft');
    if (!saved) return;

    const wf: WorkflowDTO = JSON.parse(saved);

    if (this.editor && wf.drawflowJson) {
      const importJson = JSON.parse(wf.drawflowJson);
      const drawflow = JSON.parse(wf.drawflowJson);
      const dataStep = Object.values(drawflow?.drawflow?.Home?.data) || [];

      let ObjDataStepFinal = {};
      dataStep.forEach((item: any) => {
        const lblItem = this.getStepLabel(item.name, item.data.stepData)

        ObjDataStepFinal[item.id] = {
          ...item,
          data: {
            ...item.data,
            label: lblItem
          }
        }
      })

      const finalDataImport = {
        drawflow: {
          Home: {
            data: ObjDataStepFinal
          }
        }
      }



      this.editor.import(finalDataImport);

      Object.values(ObjDataStepFinal).forEach((item: any) => {
        this.editor.updateConnectionNodes(item.id);
      })


      setTimeout(() => {
        this.editor.updateConnectionNodes('all');
      }, 1000);
    }
  }


  buildContainerWorkflow(): void {
    const container: HTMLElement = this.drawflowEl.nativeElement;

    if (container && !this.editor) {
      this.editor = new Drawflow(container);
      this.editor.reroute = true;
      this.editor.start();
    }
  }



  nextTab(): void {
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

    this.buildContainerWorkflow();

    if (this.workflowId){
      this.buildTreeWorkflow();
      this.cdr.detectChanges();
    }

  }

  canProceedToNextTab(): boolean {
    if (!this.workflowName || this.triggerConditions.length === 0) {
      this.errorMessage = 'Vui lòng nhập tên workflow và thêm ít nhất một điều kiện.';
      return false;
    }
    this.errorMessage = '';  // Reset error message if valid
    return true;
  }

  resetWorkflow(): void {
    // Reset tab về tab 1
    this.tab = 1;
    this.workflowName = ''; // Reset tên workflow
    this.workflowId = null;

    this.newTrigger = {
      conditionType: '',
      logicOperator: 'AND',
      value: {}
    };
    this.editIndex = null;
    this.triggerConditions = []; // Xóa danh sách trigger conditions
    this.isStepModalOpen = false;

    // Đặt lại các bước trong workflow
    this.selectedStepType = ''; // Xóa bước đã chọn
    this.stepData = {}; // Reset dữ liệu bước

    // Đảm bảo không có lỗi hiển thị
    this.errorMessage = '';
  }

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
        const email = this.emailTemplates.find(t => Number(t.id) === Number(data.email_template_id));
        return `📧 ${email?.name || 'Email'}`;
      case 'WAIT':
        return `⏱️ Chờ ${data.days} ngày`;
      case 'ADD_TAG':
        const tag1 = this.tags.find(t => Number(t.id) === Number(data.tag_id));
        return `➕ Tag: ${tag1?.name || 'tag'}`;
      case 'REMOVE_TAG':
        const tag2 = this.tags.find(t => Number(t.id) === Number(data.tag_id));
        return `➖ Tag: ${tag2?.name || 'tag'}`;
      case 'ADD_TO_SEQUENCE':
        const seq = this.sequences.find(s => Number(s.id) === Number(data.sequence_id));
        return `🔁 Chuỗi: ${seq?.name || 'sequence'}`;
      default:
        return type;
    }
  }

  submitWorkflow(): void {
    const dto = this.buildWorkflowDTO();
    console.log("Calling API with data: ", dto);

    if (!dto.name || dto.triggerConditions.length === 0 || dto.steps.length === 0) {
      alert('❌ Vui lòng nhập đầy đủ tên workflow, điều kiện trigger và ít nhất 1 bước!');
      return;
    }

    const request = omit(dto, ['status']);

    if (this.workflowId) {
      // 👉 UPDATE
      this.workflowService.updateWorkflow(this.workflowId, request).subscribe({
        next: (res) => {
          if (res.success) {
            alert('✅ Cập nhật workflow thành công!');
            localStorage.removeItem('workflow_draft');
            this.router.navigate(['/workflows']); // 👉 điều hướng về danh sách
          } else {
            alert('❌ Cập nhật thất bại: ' + res.message);
          }
        },
        error: () => {
          alert('❌ Có lỗi xảy ra khi cập nhật workflow');
        }
      });
    } else {
      // 👉 CREATE
      this.workflowService.createWorkflow(request).subscribe({
        next: (res) => {
          if (res.success && res.data) {
            alert('✅ Tạo workflow thành công!');
            localStorage.removeItem('workflow_draft');
            this.router.navigate([`/workflows/builder/${res.data}`, ]); // 👉 hoặc chuyển sang chi tiết
          } else {
            alert('❌ Tạo thất bại: ' + res.message);
          }
        },
        error: () => {
          alert('❌ Có lỗi xảy ra khi tạo workflow');
        }
      });
    }
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

    const  drawflowJson = JSON.stringify(exported);

    return {
      id: 0,
      userId: 0,
      name: this.workflowName,
      status: 'DRAFT',
      drawflowJson:drawflowJson,
      triggerConditions: triggerConditions,
      steps: steps
    };
  }

  saveToLocal() {
    const dto = this.buildWorkflowDTO();
    localStorage.setItem('workflow_draft', JSON.stringify(dto));
  }

}
