import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {SmtpSetting, UserDTO} from './setting.model';
import {ApiResponse} from "@core/models";
import {BaseApiService} from "@core/services/base-api.service";

@Injectable({ providedIn: 'root' })
export class SettingsService extends BaseApiService {
  private api = this.buildUrl('/settings');

  // Business Info
  getBusinessInfo(): Observable<ApiResponse<UserDTO>> {
    return this.http.get<ApiResponse<UserDTO>>(`${this.api}/business`);
  }

  updateBusinessInfo(data: UserDTO): Observable<ApiResponse<string>> {
    return this.http.put<ApiResponse<string>>(`${this.api}/business`, data);
  }

  // SMTP
  getSmtpSetting(): Observable<ApiResponse<SmtpSetting>> {
    return this.http.get<ApiResponse<SmtpSetting>>(`${this.api}/smtp`);
  }

  saveSmtpSetting(data: SmtpSetting): Observable<ApiResponse<SmtpSetting>> {
    return this.http.put<ApiResponse<SmtpSetting>>(`${this.api}/smtp`, data);
  }

  // Password
  changePassword(data: UserDTO): Observable<ApiResponse<string>> {
    return this.http.put<ApiResponse<string>>(`${this.api}/change-password`, data);
  }
}
