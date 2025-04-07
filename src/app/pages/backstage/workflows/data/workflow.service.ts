import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { WorkflowDTO } from './workflow.dto';

@Injectable()
export class WorkflowService {
  constructor(private http: HttpClient) {}


  private workflows: WorkflowDTO[] = [
    {
      id: 1,
      userId: 1,
      name: 'Welcome Sequence',
      status: 'ACTIVE',
      triggerConditions: [
        {
          conditionType: 'TAG',
          conditionData: JSON.stringify({ tag_id: 101 }),
          logicOperator: 'AND',
          position: 1
        }
      ],
      steps: [
        {
          stepType: 'SEND_EMAIL',
          stepData: JSON.stringify({ email_template_id: 12 }),
          position: 1
        },
        {
          stepType: 'WAIT',
          stepData: JSON.stringify({ days: 2 }),
          position: 2
        },
        {
          stepType: 'ADD_TAG',
          stepData: JSON.stringify({ tag_id: 202 }),
          position: 3
        }
      ]
    },
    {
      id: 2,
      userId: 1,
      name: 'Upsell Workflow',
      status: 'DRAFT',
      triggerConditions: [
        {
          conditionType: 'INTERACTION',
          conditionData: JSON.stringify({ action: 'CLICK' }),
          logicOperator: 'AND',
          position: 1
        }
      ],
      steps: [
        {
          stepType: 'SEND_EMAIL',
          stepData: JSON.stringify({ email_template_id: 15 }),
          position: 1
        },
        {
          stepType: 'ADD_TO_SEQUENCE',
          stepData: JSON.stringify({ sequence_id: 7 }),
          position: 2
        }
      ]
    }
  ];


  getAllWorkflows(): Observable<WorkflowDTO[]> {
    return of(this.workflows);
  }

  getWorkflowById(id: number): Observable<WorkflowDTO | undefined> {
    const workflow = this.workflows.find(w => (w as any).id === id);
    return of(workflow);
  }

  createWorkflow(workflow: WorkflowDTO): Observable<WorkflowDTO> {
    this.workflows.push(workflow);
    return of(workflow);
  }

  updateWorkflow(updated: WorkflowDTO): Observable<WorkflowDTO> {
    const index = this.workflows.findIndex(w => w.name === updated.name);
    if (index !== -1) this.workflows[index] = updated;
    return of(updated);
  }

  deleteWorkflow(name: string): Observable<boolean> {
    this.workflows = this.workflows.filter(w => w.name !== name);
    return of(true);
  }

  getAllTags(): Observable<{ id: number; name: string }[]> {
    return of([
      { id: 1, name: 'LEAD' },
      { id: 2, name: 'BUYER' }
    ]);
  }

  getAllEmails(): Observable<{ id: number; name: string }[]> {
    return of([
      { id: 1, name: 'Chào mừng' },
      { id: 2, name: 'Cảm ơn' }
    ]);
  }

  getAllSequences(): Observable<{ id: number; name: string }[]> {
    return of([
      { id: 1, name: 'Welcome Series' },
      { id: 2, name: 'Upsell Series' }
    ]);
  }

}
