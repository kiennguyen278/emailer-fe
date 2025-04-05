import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  SaveSubscriberRequest,
  SaveTagRequest,
  SubscriberDetailDTO,
  SubscriberResponseDTO,
  SubscriberSearchDTO, SubscriberStatsDTO,
  TagDTO
} from '../models';
import { omit } from 'lodash';
import {BaseApiService} from "@core/services/base-api.service";
import {ApiResponse} from "@core/models/response.model";

@Injectable({ providedIn: 'root' })
export class SubscribersService extends BaseApiService{

  getAllTag(): Observable<TagDTO[]> {
    const url = this.buildUrl('/tags');
    return this.http.get<ApiResponse<TagDTO[]>>(url).pipe(
      map(res => res.data)
    );
  }

  saveTag(request: SaveTagRequest): Observable<any> {
    if (request.id){
      const url = this.buildUrl(`/tags/${request.id}`);
      return this.http.put<ApiResponse<any>>(url, null, {params: {newName: request.name}});
    } else {
      const url = this.buildUrl(`/tags`);
      return this.http.post<ApiResponse<any>>(url, null, {params: {name: request.name}});
    }
  }

  delete(id: number): Observable<any> {
    const url = this.buildUrl(`/tags/${id}`);
    return this.http.delete<ApiResponse<any>>(url);
  }

  getListSubscribers(params: SubscriberSearchDTO): Observable<any> {
    const url = this.buildUrl('/subscribers/search');
    const paramRequest = {...params, page: params.page - 1};
    return this.http.get<ApiResponse<SubscriberResponseDTO>>(url,{params: {...paramRequest}} );
  }

  saveSubscribers(request: SaveSubscriberRequest): Observable<any> {
    if (request.id){
      const bodyRequest = omit(request, 'id');
      const url = this.buildUrl(`/subscribers/${request.id}`);
      return this.http.put<ApiResponse<any>>(url, bodyRequest,);
    } else {
      const url = this.buildUrl(`/subscribers`);
      return this.http.post<ApiResponse<any>>(url, request);
    }
  }

  deleteSubscriber(id: number): Observable<any> {
    const url = this.buildUrl(`/subscribers/${id}`);
    return this.http.delete<ApiResponse<any>>(url);
  }


  importCSV(file: File, tagId?: number): Observable<any> {
    const url = this.buildUrl(`/subscribers/import-csv`);
    const formData = new FormData();
    formData.append('file', file);
    if (tagId) {
      formData.append('tagId', tagId.toString());
    }
    //return this.http.post(url, formData);
    return this.http.post<ApiResponse<any>>(url, formData);
  }


  getSubscriberDetail(id: number): Observable<ApiResponse<SubscriberDetailDTO>> {
    const url = this.buildUrl(`/subscribers/${id}`);
    return this.http.get<ApiResponse<SubscriberDetailDTO>>(url);
  }

  getOverviewStats(): Observable<ApiResponse<SubscriberStatsDTO>> {
    const url = this.buildUrl(`/dashboard/subscriber-stats`);
    return this.http.get<ApiResponse<SubscriberStatsDTO>>(url);
  }

}
