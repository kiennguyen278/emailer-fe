import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {IntegrationSettingDTO} from "./setting.model";
import {BaseApiService} from "@core/services/base-api.service";
import {ApiResponse} from "@core/models";

@Injectable({ providedIn: 'root' })
export class IntegrationService extends BaseApiService {
  private api = this.buildUrl('/integrations');

  getAll(): Observable<ApiResponse<IntegrationSettingDTO[]>> {
    return this.http.get<ApiResponse<IntegrationSettingDTO[]>>(`${this.api}`);
  }

  create(data: IntegrationSettingDTO): Observable<ApiResponse<IntegrationSettingDTO>> {
    return this.http.post<ApiResponse<IntegrationSettingDTO>>(`${this.api}`, data);
  }

  update(id: number, data: IntegrationSettingDTO): Observable<ApiResponse<IntegrationSettingDTO>> {
    return this.http.put<ApiResponse<IntegrationSettingDTO>>(`${this.api}/${id}`, data);
  }

  delete(id: number): Observable<ApiResponse<string>> {
    return this.http.delete<ApiResponse<string>>(`${this.api}/${id}`);
  }

  testConnection(dto: IntegrationSettingDTO): Observable<any> {
    return this.http.post(`${this.api}/testConnection`, dto);
  }

  pull(id: number): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.api}/${id}/pull`, {});
  }

  pullAll(id: number): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.api}/${id}/pullAll`, {});
  }
}
