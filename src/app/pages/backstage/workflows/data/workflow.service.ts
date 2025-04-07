import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {WorkflowDTO, Tag, EmailTemplateDTO,SequenceDTO} from './workflow.dto';
import {BaseApiService} from "@core/services/base-api.service";
import {ApiResponse} from "@core/models";
import {HttpParams} from "@angular/common/http";

@Injectable({ providedIn: 'root' })
export class WorkflowService extends BaseApiService {
  private readonly BASE_URL = this.buildUrl('/workflows');

  createWorkflow(workflow: WorkflowDTO): Observable<{ success: boolean; message: string; data: number }> {
    return this.http.post<{ success: boolean; message: string; data: number }>(this.BASE_URL, workflow);
  }

  updateWorkflow(id: number, workflow: WorkflowDTO): Observable<{ success: boolean; message: string }> {
    return this.http.put<{ success: boolean; message: string }>(`${this.BASE_URL}/${id}`, workflow);
  }

  deleteWorkflow(id: number): Observable<any> {
    return this.http.delete(`${this.BASE_URL}/${id}`);
  }

  updateWorkflowStatus(id: number, status: string): Observable<any> {
    return this.http.put(`${this.BASE_URL}/${id}/status`, { status });
  }

  getWorkflowDetail(id: number): Observable<{ success: boolean; data: WorkflowDTO }> {
    return this.http.get<{ success: boolean; data: WorkflowDTO }>(`${this.BASE_URL}/${id}`);
  }

  getWorkflowList(): Observable<ApiResponse<WorkflowDTO[]>> {
    const params = new HttpParams();
    return this.http.get<ApiResponse<WorkflowDTO[]>>(`${this.BASE_URL}`);
  }

  getAllTags(): Observable<ApiResponse<Tag[]>> {
    return this.http.get<ApiResponse<Tag[]>>(`${this.buildUrl('/tags')}`);
  }

  getEmailTemplates(): Observable<ApiResponse<EmailTemplateDTO[]>> {
    return this.http.get<ApiResponse<EmailTemplateDTO[]>>(`${this.buildUrl('/email-templates')}`);
  }

  getEmailSequences(): Observable<ApiResponse<SequenceDTO[]>> {
    return this.http.get<ApiResponse<SequenceDTO[]>>(`${this.buildUrl('/sequences')}`);
  }

}
