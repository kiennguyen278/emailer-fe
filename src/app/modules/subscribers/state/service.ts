import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '@environment';
import { ApiResponse } from '@core/models';
import { SaveTagRequest, TagDTO } from '../models';
import { BaseApiService } from '@core/services';

@Injectable({ providedIn: 'root' })
export class SubscribersService extends BaseApiService{
  private readonly baseUrl = `${environment.baseUrl}/tags`;

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

  create(name: string): Observable<any> {
    return this.http.post<ApiResponse<any>>(this.baseUrl, { name });
  }

  update(id: number, name: string): Observable<any> {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}/${id}`, { name });
  }

  delete(id: number): Observable<any> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/${id}`);
  }
}
