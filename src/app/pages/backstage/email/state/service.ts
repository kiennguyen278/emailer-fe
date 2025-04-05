import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { omit } from 'lodash';
import {BaseApiService} from "@core/services/base-api.service";
import {ApiResponse} from "@core/models/response.model";
import {
  CampaignDetailDTO,
  EmailCampaignDTO,
  EmailTemplateDTO,
  SaveEmailCampaignRequest,
  SaveEmailTemplateRequest, SaveSequenceRequest, SaveStepSequenceRequest, SequenceDTO
} from "../models";

@Injectable({ providedIn: 'root' })
export class EmailService extends BaseApiService{

  getAllEmailTemplate(): Observable<EmailTemplateDTO[]> {
    const url = this.buildUrl('/email-templates');
    return this.http.get<ApiResponse<EmailTemplateDTO[]>>(url).pipe(
      map(res => res.data)
    );
  }


  getDetailTemplateById(id: number): Observable<any> {
    const url = this.buildUrl(`/email-templates/${id}`);
    return this.http.get<ApiResponse<EmailTemplateDTO>>(url);
  }

  saveMailTemplate(request: SaveEmailTemplateRequest): Observable<any> {
    if (request.id){
      const url = this.buildUrl(`/email-templates/${request.id}`);
      return this.http.put<ApiResponse<any>>(url, request);
    } else {
      const url = this.buildUrl(`/email-templates`);
      return this.http.post<ApiResponse<any>>(url, request);
    }
  }

  deleteMailTemplate(id: number): Observable<any> {
    const url = this.buildUrl(`/email-templates/${id}`);
    return this.http.delete<ApiResponse<any>>(url);
  }



  getAllEmailCampaign(): Observable<EmailCampaignDTO[]> {
    const url = this.buildUrl('/campaigns');
    return this.http.get<ApiResponse<EmailCampaignDTO[]>>(url).pipe(
      map(res => res.data)
    );
  }


  deleteMailCampaign(id: number): Observable<any> {
    const url = this.buildUrl(`/campaigns/${id}`);
    return this.http.delete<ApiResponse<any>>(url);
  }


  saveMailCampaign(request: SaveEmailCampaignRequest): Observable<any> {
    if (request.id){
      const url = this.buildUrl(`/campaigns/${request.id}`);
      return this.http.put<ApiResponse<any>>(url, request);
    } else {
      const url = this.buildUrl(`/campaigns`);
      return this.http.post<ApiResponse<any>>(url, request);
    }
  }


  getDetailCampaignsById(id: number): Observable<any> {
    const url = this.buildUrl(`/campaigns/${id}`);
    return this.http.get<ApiResponse<CampaignDetailDTO>>(url);
  }



  getAllSequence(): Observable<SequenceDTO[]> {
    const url = this.buildUrl('/sequences');
    return this.http.get<ApiResponse<SequenceDTO[]>>(url).pipe(
      map(res => res.data)
    );
  }



  deleteSequence(id: number): Observable<any> {
    const url = this.buildUrl(`/sequences/${id}`);
    return this.http.delete<ApiResponse<any>>(url);
  }


  saveSequence(request: SaveSequenceRequest): Observable<any> {
    if (request.id){
      const url = this.buildUrl(`/sequences/${request.id}`);
      return this.http.put<ApiResponse<any>>(url, request);
    } else {
      const url = this.buildUrl(`/sequences`);
      return this.http.post<ApiResponse<any>>(url, request);
    }
  }

  saveStepSequence(request: SaveStepSequenceRequest): Observable<any> {
    if (request.id){
      const url = this.buildUrl(`/sequences/steps/${request.id}`);
      return this.http.put<ApiResponse<any>>(url, request);
    } else {
      const url = this.buildUrl(`/sequences/${request.sequenceId}/steps`);
      return this.http.post<ApiResponse<any>>(url, request);
    }
  }








}
