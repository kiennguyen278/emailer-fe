import { Component, OnInit } from '@angular/core';
import { WorkflowService } from '../data/workflow.service';
import { WorkflowDTO } from '../data/workflow.dto';
import {NzModalService} from "ng-zorro-antd/modal";
import {SwitchStatusWorkflowRequest} from "../models";
import {take} from "rxjs/operators";
import {NotificationService} from "@core/services/notification.service";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.less']
})
export class MainComponent implements OnInit {
  workflows: WorkflowDTO[] = [];
  loading = false;

  constructor(
    private workflowService: WorkflowService,
    private modal: NzModalService,
    private notification: NotificationService,
  ) {}

  ngOnInit(): void {
    this.loadWorkflows();
  }

  loadWorkflows(): void {
    this.loading = true;

    this.workflowService.getWorkflowList().subscribe({
      next: (res) => {
        if (res.success) {
          this.workflows = res.data.map((item: WorkflowDTO)=> {
            return {
              ...item,
              activeStatus: item.status === 'ACTIVE',
            }
          });
        } else {
          console.warn('⚠️ API trả về lỗi:', res.message);
          this.workflows = [];
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Lỗi khi gọi API:', err);
        this.loading = false;
        this.workflows = [];
      }
    });
  }

  confirmDelete(id: number): void {
    const confirmed = confirm('❗Bạn có chắc muốn xoá workflow này không?');
    if (!confirmed) return;

    this.workflowService.deleteWorkflow(id).subscribe({
      next: (res) => {
        if (res.success) {
          alert('🗑️ Đã xoá workflow');
          this.loadWorkflows(); // reload danh sách
        } else {
          alert('❌ Xoá thất bại: ' + res.message);
        }
      },
      error: () => {
        alert('❌ Lỗi khi xoá workflow');
      }
    });
  }


  onSwitchStatus(item: WorkflowDTO){
    const request: SwitchStatusWorkflowRequest = {
      id: item.id!,
      status: !item.activeStatus,
    }
    this.workflowService.switchStatusWorkFlow(request)
      .pipe()
      .subscribe(res => {
        this.loadWorkflows();
        this.notification.open({
          type: 'success',
          content: res?.message || 'Trạng thái đã được cập nhật'
        });
      })
  }

  confirmSwitchStatus(item: any){
    this.modal.confirm({
      nzTitle: `Bạn có muốn thay đổi trạng thái của workflow "${item.name}"?`,
      nzOkText: 'OK',
      nzOnOk: () => this.onSwitchStatus(item)
    });
  }




}
