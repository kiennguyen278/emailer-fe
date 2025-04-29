import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {IntegrationSettingDTO} from "./setting.model";
import {BaseApiService} from "@core/services/base-api.service";

@Injectable({ providedIn: 'root' })
export class IntegrationService extends BaseApiService {
  private api = this.buildUrl('/integrations');

  list(): Observable<IntegrationSettingDTO[]> {
    return this.http.get<IntegrationSettingDTO[]>(this.api);
  }

  get(id: number): Observable<IntegrationSettingDTO> {
    return this.http.get<IntegrationSettingDTO>(`${this.api}/${id}`);
  }

  create(dto: IntegrationSettingDTO): Observable<IntegrationSettingDTO> {
    return this.http.post<IntegrationSettingDTO>(this.api, dto);
  }

  update(id: number, dto: IntegrationSettingDTO): Observable<IntegrationSettingDTO> {
    return this.http.put<IntegrationSettingDTO>(`${this.api}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}
