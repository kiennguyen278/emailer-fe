import { Component, OnInit } from '@angular/core';
import { WorkflowService } from '../data/workflow.service';
import { WorkflowDTO } from '../data/workflow.dto';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.less']
})
export class MainComponent implements OnInit {
  workflows: WorkflowDTO[] = [];
  loading = false;

  constructor(private workflowService: WorkflowService) {}

  ngOnInit(): void {
    this.loadWorkflows();
  }

  loadWorkflows(): void {
    this.loading = true;

    this.workflowService.getWorkflowList().subscribe({
      next: (res) => {
        if (res.success) {
          this.workflows = res.data;
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
}
