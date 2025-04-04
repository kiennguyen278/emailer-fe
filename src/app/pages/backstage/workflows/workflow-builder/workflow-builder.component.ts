import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import Drawflow from 'drawflow';
import {ActivatedRoute, Router} from '@angular/router';
import {WorkflowService} from '../data/workflow.service';
import {TriggerConditionDTO, WorkflowDTO, WorkflowStepDTO} from '../data/workflow.dto';

interface NamedItem {
  id: number;
  name: string;
}

@Component({
  selector: 'app-workflow-builder',
  templateUrl: './workflow-builder.component.html',
  styleUrls: ['./workflow-builder.component.less']
})
export class WorkflowBuilderComponent implements AfterViewInit, OnInit {
  @ViewChild('drawflowElement', { static: true }) drawflowElement!: ElementRef;
  editor: any;
  nodeIdCounter = 1;
  triggerConditionsSnapshot: TriggerConditionDTO[] = [];
  availableTags: NamedItem[] = [];
  availableSequences: NamedItem[] = [];
  availableEmails: NamedItem[] = [];
  workflows: NamedItem[] = [];

  currentStep: number = 1;
  workflowName: string = '';

  workflowId: number | null = null;

  loadedSteps: WorkflowStepDTO[] = [];  // ✅ Dùng để lưu lại steps khi load workflow

  triggerTypes = [
    { value: 'TAG', label: 'Khi có Tag' },
    { value: 'INTERACTION', label: 'Tương tác Email' },
    { value: 'INACTIVE', label: 'Không hoạt động' },
    { value: 'SUBSCRIBED_BEFORE', label: 'Đăng ký trước đó' }
  ];

  triggerConditions: TriggerConditionDTO[] = [];
  newTrigger: TriggerConditionDTO = { conditionType: '', conditionData: '', logicOperator: 'AND', position: 0 };
  editIndex: number | null = null;

  constructor(
    private workflowService: WorkflowService,
    private router: Router,
    private route: ActivatedRoute
  ) {}



  ngOnInit(): void {
    this.workflowService.getAllTags().subscribe(tags => this.availableTags = tags);
    this.workflowService.getAllSequences().subscribe(seq => this.availableSequences = seq);
    this.workflowService.getAllEmails().subscribe(emails => this.availableEmails = emails);

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.workflowId = +idParam;
    }

    (window as any).editStepNode = (nodeId: number, event: Event) => {
      const node = this.editor.getNodeFromId(nodeId);
      const value = (event.target as HTMLInputElement | HTMLSelectElement).value;

      if (node.name === 'send_email') {
        node.data.stepData = JSON.stringify({ email_template_id: +value });
      } else if (node.name === 'add_tag' || node.name === 'remove_tag') {
        node.data.stepData = JSON.stringify({ tag_id: +value });
      } else if (node.name === 'add_to_sequence') {
        node.data.stepData = JSON.stringify({ sequence_id: +value });
      } else if (node.name === 'delay') {
        node.data.stepData = JSON.stringify({ days: +value });
      }

      const newHtml = node.html;
      this.editor.updateNodeDataFromId(nodeId, node.data);
      this.editor.updateNodeHtmlFromId(nodeId, newHtml);
    };
  }


  ngAfterViewInit(): void {
    this.editor = new Drawflow(this.drawflowElement.nativeElement);
    this.editor.reroute = true;
    this.editor.start();

    if (this.workflowId) {
      this.loadWorkflowById(this.workflowId);
    }
  }

  loadWorkflowById(id: number) {
    this.workflowService.getWorkflowById(id).subscribe(wf => {
      if (!wf) return;

      this.workflowId = wf.id;
      this.workflowName = wf.name;
      this.triggerConditions = [...wf.triggerConditions];
      this.triggerConditionsSnapshot = [...wf.triggerConditions];

      // 👉 Không vẽ START nếu chưa sang bước 2
      this.loadedSteps = wf.steps; // ✅ Lưu lại để render khi sang step 2

      if (this.triggerConditions.length) {
        const lastTrig = this.triggerConditions[this.triggerConditions.length - 1];
        this.newTrigger = { ...lastTrig };
      }

      this.currentStep = 1;
    });
  }

  renderWorkflowSteps(steps: WorkflowStepDTO[]) {
    steps.forEach((step, i) => {
      const type = step.stepType.toLowerCase();
      const posX = 300 + i * 40;
      const posY = 200 + i * 30;

      this.editor.addNode(
        type,
        1, 1, posX, posY,
        type,
        { stepData: step.stepData },
        '<div>🧩 Đang tải...</div>'
      );
    });
  }

  addOrUpdateTrigger() {
    const { conditionType, conditionData } = this.newTrigger;
    if (!conditionType) {
      alert('⚠️ Vui lòng chọn loại điều kiện trigger.');
      return;
    }

    const parsed = (() => { try { return JSON.parse(conditionData); } catch { return {}; } })();

    if (conditionType === 'TAG' && !parsed.tag_id) {
      alert('⚠️ Bạn chưa chọn Tag.');
      return;
    }
    if (conditionType === 'SUBSCRIBED_BEFORE' && !parsed.before_date) {
      alert('⚠️ Bạn chưa chọn ngày đăng ký.');
      return;
    }
    if (conditionType === 'INACTIVE' && (!parsed.days || isNaN(+parsed.days))) {
      alert('⚠️ Bạn chưa nhập số ngày không hoạt động hợp lệ.');
      return;
    }
    if (conditionType === 'INTERACTION' && !parsed.action) {
      alert('⚠️ Bạn chưa chọn hành động tương tác.');
      return;
    }

    const index = this.editIndex;
    const position = index !== null ? this.newTrigger.position : this.triggerConditions.length + 1;

    const item: TriggerConditionDTO = {
      conditionType,
      conditionData,
      logicOperator: this.newTrigger.logicOperator,
      position
    };

    if (index !== null) {
      this.triggerConditions[index] = item;
    } else {
      this.triggerConditions.push(item);
    }

    this.newTrigger = {
      conditionType: '',
      conditionData: '',
      logicOperator: 'AND',
      position: 0
    };
    this.editIndex = null;

    // Bỏ gọi confirmTrigger tại đây để không vẽ node START trong step 1
  }

// ✅ Hiển thị tên rõ ràng thay vì raw ID trong preview
  getTriggerLabel(trig: TriggerConditionDTO): string {
    const data = (() => { try { return JSON.parse(trig.conditionData); } catch { return {}; } })();

    if (trig.conditionType === 'TAG') {
      const tag = this.availableTags.find(t => t.id === data.tag_id);
      return `Tag: ${tag?.name || data.tag_id}`;
    }
    if (trig.conditionType === 'SUBSCRIBED_BEFORE') {
      return `Đăng ký trước: ${data.before_date}`;
    }
    if (trig.conditionType === 'INACTIVE') {
      return `Không hoạt động: ${data.days} ngày`;
    }
    if (trig.conditionType === 'INTERACTION') {
      return `Tương tác: ${data.action}`;
    }
    return JSON.stringify(data);
  }

// ✅ Thêm hàm quay lại bước 1, nếu có thay đổi thì reset
  previousStep(force = false) {
    const before = JSON.stringify(this.triggerConditionsSnapshot);
    const current = JSON.stringify(this.triggerConditions);
    const changed = before !== current;

    this.currentStep = 1;

    if (force || changed) {
      this.editor.clear();
    }
  }

// ✅ Tạo snapshot trigger trước khi nextStep
  nextStep() {
    if (!this.workflowName.trim()) {
      alert('⚠️ Vui lòng nhập tên workflow.');
      return;
    }

    if (!this.triggerConditions.length) {
      alert('⚠️ Cần ít nhất một trigger để tiếp tục.');
      return;
    }

    for (let i = 0; i < this.triggerConditions.length; i++) {
      const trig = this.triggerConditions[i];
      const data = (() => { try { return JSON.parse(trig.conditionData); } catch { return {}; } })();

      if (trig.conditionType === 'TAG' && !data.tag_id) {
        alert(`⚠️ Trigger ${i + 1} thiếu tag_id.`);
        return;
      }
      if (trig.conditionType === 'SUBSCRIBED_BEFORE' && !data.before_date) {
        alert(`⚠️ Trigger ${i + 1} thiếu ngày đăng ký.`);
        return;
      }
      if (trig.conditionType === 'INACTIVE' && (!data.days || isNaN(+data.days))) {
        alert(`⚠️ Trigger ${i + 1} thiếu số ngày không hoạt động.`);
        return;
      }
      if (trig.conditionType === 'INTERACTION' && !data.action) {
        alert(`⚠️ Trigger ${i + 1} thiếu hành động tương tác.`);
        return;
      }
    }

    this.editor.clear();            // ✅ clear canvas
    this.confirmTrigger();          // ✅ vẽ lại START
    this.triggerConditionsSnapshot = [...this.triggerConditions];
    this.currentStep = 2;
  }

// ✅ Cho phép click tab header để chuyển step
  goToStep(step: number) {
    if (step === 1 && this.currentStep === 2) {
      this.currentStep = 1;
      this.editor.clear(); // ✅ không hiển thị START khi quay lại step 1
    } else if (step === 2 && this.currentStep === 1) {
      this.nextStep();
    }
  }

  // ✅ Hàm tạo workflow (dùng dữ liệu từ editor + trigger)
  createWorkflow() {
    const json = this.editor.export();
    const steps: WorkflowStepDTO[] = Object.values(json.drawflow.Home.data)
      .filter((node: any) => node.name !== 'start')
      .map((node: any, index: number) => ({
        stepType: node.name.toUpperCase(),
        stepData: node.data.stepData,
        position: index + 1
      }));

    const dto: WorkflowDTO = {
      id: this.workflowId ?? Date.now(),
      userId: 1,
      name: this.workflowName || 'Workflow không tên',
      description: 'Tạo từ Workflow Builder',
      status: 'ACTIVE',
      triggerConditions: this.triggerConditions,
      steps
    };

    const action = this.workflowId
      ? this.workflowService.updateWorkflow(dto)
      : this.workflowService.createWorkflow(dto);

    action.subscribe({
      next: () => {
        alert(`✅ Workflow đã được ${this.workflowId ? 'cập nhật' : 'tạo mới'}!`);
        this.router.navigate(['/workflows']);
      },
      error: () => {
        alert('❌ Gặp lỗi khi lưu workflow!');
      }
    });
  }

// ✅ Hàm reset toàn bộ workflow về trạng thái ban đầu
  resetWorkflow() {
    this.workflowName = '';
    this.triggerConditions = [];
    this.editIndex = null;
    this.newTrigger = {
      conditionType: '',
      conditionData: '',
      logicOperator: 'AND',
      position: 0
    };
    this.editor.clear();
  }

  addNode(type: string) {
    if (this.currentStep !== 2) return; // ✅ chỉ cho phép thêm node khi đang ở bước 2

    const id = this.nodeIdCounter++;
    let html = '';
    const inputs = 1;
    const outputs = 1;
    let data: string = '';

    if (type === 'send_email') {
      data = '';
      html = `<div><strong>📧 Send Email</strong><br/>
      <select onchange="window.editStepNode(${id}, event)">
        <option value="">-- Chọn email --</option>
        ${this.availableEmails.map(e => `<option value='${e.id}'>${e.name}</option>`).join('')}
      </select>
    </div>`;
    } else if (type === 'delay') {
      data = JSON.stringify({ days: 1 });
      html = `<div><strong>⏱️ Wait</strong><br/>
      <input type='number' min='1' value='1' style='width: 60px' onchange="window.editStepNode(${id}, event)" /> day(s)
    </div>`;
    } else if (type === 'add_tag') {
      data = '';
      html = `<div><strong>🏷️ Add Tag</strong><br/>
      <select onchange="window.editStepNode(${id}, event)">
        <option value="">-- Chọn tag --</option>
        ${this.availableTags.map(tag => `<option value='${tag.id}'>${tag.name}</option>`).join('')}
      </select>
    </div>`;
    } else if (type === 'remove_tag') {
      data = '';
      html = `<div><strong>❌ Remove Tag</strong><br/>
      <select onchange="window.editStepNode(${id}, event)">
        <option value="">-- Chọn tag --</option>
        ${this.availableTags.map(tag => `<option value='${tag.id}'>${tag.name}</option>`).join('')}
      </select>
    </div>`;
    } else if (type === 'add_to_sequence') {
      data = '';
      html = `<div><strong>📥 Add to Sequence</strong><br/>
      <select onchange="window.editStepNode(${id}, event)">
        <option value="">-- Chọn sequence --</option>
        ${this.availableSequences.map(seq => `<option value='${seq.id}'>${seq.name}</option>`).join('')}
      </select>
    </div>`;
    }

    this.editor.addNode(type, inputs, outputs, 300 + id * 40, 120 + id * 30, type, { stepData: data }, html);
  }

  exportWorkflow() {
    const json = this.editor.export();
    const steps: WorkflowStepDTO[] = Object.values(json.drawflow.Home.data)
      .filter((node: any) => node.name !== 'start')
      .map((node: any, index: number) => ({
        stepType: node.name.toUpperCase(),
        stepData: node.data.stepData,
        position: index + 1
      }));

    const exported: WorkflowDTO = {
      id:1,
      userId: 1,
      name: 'Chuỗi chăm sóc khách hàng mới',
      description: 'Workflow gửi email welcome và chăm sóc',
      status: 'ACTIVE',
      triggerConditions: this.triggerConditions,
      steps
    };

    console.log('WorkflowDTO:', exported);
  }


  confirmTrigger() {
    if (!this.triggerConditions.length) return;

    // 👉 Xoá node start nếu đã tồn tại
    const allNodes = this.editor.export().drawflow.Home.data;
    for (const nodeId in allNodes) {
      const node = allNodes[nodeId];
      if (node.name === 'start') {
        this.editor.removeNodeFromId(+nodeId);
        break;
      }
    }

    this.editor.addNode(
      'start',
      0, 1, 50, 100,
      'start',
      { triggerConditions: this.triggerConditions },
      this.renderStartHtml()
    );

  }

  editTrigger(index: number) {
    this.newTrigger = { ...this.triggerConditions[index] };
    this.editIndex = index;
  }

  removeTrigger(index: number) {
    this.triggerConditions.splice(index, 1);

    // Cập nhật lại position
    this.triggerConditions.forEach((t, i) => t.position = i + 1);

    // Nếu đang sửa mà bị xoá → reset
    if (this.editIndex === index) {
      this.editIndex = null;
      this.newTrigger = {
        conditionType: '',
        conditionData: '',
        logicOperator: 'AND',
        position: 0
      };
    }
    //this.confirmTrigger();
  }

  renderStartHtml(): string {
    return `<div class="node-start">
    <strong>🚀 Start</strong><br/>
    ${this.triggerConditions.map(t => {
      const d = (() => { try { return JSON.parse(t.conditionData); } catch { return {}; } })();
      if (t.conditionType === 'TAG') {
        const tag = this.availableTags.find(tag => tag.id === d.tag_id);
        return `${t.logicOperator} TAG: ${tag?.name || d.tag_id}`;
      }
      if (t.conditionType === 'SUBSCRIBED_BEFORE') {
        return `${t.logicOperator} SUBSCRIBED BEFORE: ${d.before_date}`;
      }
      if (t.conditionType === 'INACTIVE') {
        return `${t.logicOperator} INACTIVE: ${d.days} ngày`;
      }
      if (t.conditionType === 'INTERACTION') {
        return `${t.logicOperator} INTERACTION: ${d.action}`;
      }
      return `${t.logicOperator} ${t.conditionType}: ${t.conditionData}`;
    }).join('<br/>')}
  </div>`;
  }



  get parsedTagId() {
    try { return JSON.parse(this.newTrigger.conditionData)?.tag_id || ''; } catch { return ''; }
  }
  onChangeTag(val: string) {
    this.newTrigger.conditionData = JSON.stringify({ tag_id: +val });
  }

  get parsedDays() {
    try { return JSON.parse(this.newTrigger.conditionData)?.days || ''; } catch { return ''; }
  }
  onChangeInactive(val: string) {
    this.newTrigger.conditionData = JSON.stringify({ days: +val });
  }

  get parsedAction() {
    try { return JSON.parse(this.newTrigger.conditionData)?.action || ''; } catch { return ''; }
  }
  onChangeInteraction(val: string) {
    this.newTrigger.conditionData = JSON.stringify({ action: val });
  }

  get parsedDate() {
    try { return JSON.parse(this.newTrigger.conditionData)?.before_date || ''; } catch { return ''; }
  }
  onChangeSubscribedBefore(val: string) {
    this.newTrigger.conditionData = JSON.stringify({ before_date: val });
  }

  handleTagChange(e: Event) {
    const id = +(e.target as HTMLSelectElement).value;
    this.onChangeTag(id.toString());
  }
  handleInactiveChange(e: Event) {
    const val = (e.target as HTMLInputElement).value;
    this.onChangeInactive(val);
  }
  handleInteractionChange(e: Event) {
    const action = (e.target as HTMLSelectElement).value;
    this.onChangeInteraction(action);
  }
  handleDateChange(e: Event) {
    const date = (e.target as HTMLInputElement).value;
    this.onChangeSubscribedBefore(date);
  }
}
