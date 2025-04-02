import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {SmtpSetting, BusinessInfo,PasswordChange} from './setting.model';
import {ApiResponse} from "@core/models";
import {BaseApiService} from "@core/services/base-api.service";

@Injectable({ providedIn: 'root' })
export class SettingsService extends BaseApiService {
  private api = this.buildUrl('/settings');

  // Business Info
  getBusinessInfo(): Observable<ApiResponse<BusinessInfo>> {
    return this.http.get<ApiResponse<BusinessInfo>>(`${this.api}/business`);
  }

  updateBusinessInfo(data: BusinessInfo): Observable<ApiResponse<string>> {
    return this.http.put<ApiResponse<string>>(`${this.api}/business`, data);
  }

  // SMTP
  getSmtpSetting(): Observable<ApiResponse<SmtpSetting>> {
    return this.http.get<ApiResponse<SmtpSetting>>(`${this.api}/smtp`);
  }

  saveSmtpSetting(data: SmtpSetting): Observable<ApiResponse<SmtpSetting>> {
    return this.http.put<ApiResponse<SmtpSetting>>(`${this.api}/saveSmtp`, data);
  }

  testSmtpConnection(data: SmtpSetting): Observable<ApiResponse<SmtpSetting>> {
    return this.http.put<ApiResponse<SmtpSetting>>(`${this.api}/smtp/testSmtpConnection`, data);
  }


  // Password
  changePassword(data: PasswordChange): Observable<ApiResponse<string>> {
    return this.http.put<ApiResponse<string>>(`${this.api}/change-password`, data);
  }

  updateCustomSmtpStatus(useCustomSmtp: boolean): Observable<ApiResponse<string>> {
    const params = { useCustomSmtp: String(useCustomSmtp) }; // ⚠️ convert to string
    return this.http.put<ApiResponse<string>>(
      `${this.api}/updateCustomSMTP`,
      null,
      { params }
    );
  }


}
