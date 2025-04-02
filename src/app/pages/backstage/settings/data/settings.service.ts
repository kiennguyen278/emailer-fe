import {Injectable} from '@angular/core';
import { BusinessSetting, SmtpSetting, PasswordChange } from '../data/setting.model';
import {Observable} from 'rxjs';
import {BaseApiService} from "@core/services/base-api.service";

@Injectable({
  providedIn: 'root'
})
export class SettingsService extends BaseApiService {
  private baseUrl = this.buildUrl('/settings');

  getSmtpSetting(): Observable<SmtpSetting> {
    return this.http.get<SmtpSetting>(`${this.baseUrl}/smtp`);
  }

  saveSmtpSetting(data: SmtpSetting): Observable<SmtpSetting> {
    return this.http.put<SmtpSetting>(`${this.baseUrl}/smtp`, data);
  }


  // Business Info
  getBusinessInfo(): Observable<BusinessSetting> {
    return this.http.get<BusinessSetting>(`${this.baseUrl}/business`);
  }

  updateBusinessInfo(data: BusinessSetting): Observable<any> {
    return this.http.put(`${this.baseUrl}/business`, data);
  }


  // Password
  changePassword(data: PasswordChange): Observable<any> {
    return this.http.post(`${this.baseUrl}/change-password`, data);
  }
}
