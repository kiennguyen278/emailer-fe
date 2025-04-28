import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {UserDTO} from "./admin.dto";
import {ApiResponse} from "@core/models";
import {BaseApiService} from "@core/services/base-api.service";
import {SaveBusinessProfileRequest, SwitchStatusBusinessRequest, SwitchStatusUserRequest} from "../models";
import {omit} from "lodash";
import {SmtpSetting} from "../../settings/data/setting.model";


@Injectable({
  providedIn: 'root'
})
export class AdminService extends BaseApiService {

  private readonly BASE_URL = this.buildUrl('/admin');

  getAllUsers(
  ): Observable<ApiResponse<UserDTO[]>> {
    // Gửi request GET với query string được cấu hình
    return this.http.get<ApiResponse<any>>(`${this.BASE_URL}/users/search`);
  }

  /**
   * Đăng ký người dùng mới
   */
  createUser(userDTO: UserDTO): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.BASE_URL}/users/register`, userDTO, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  updateUserStatus(request: SwitchStatusUserRequest) {
    const url = this.buildUrl(`admin/users/${request.userId}/status`);

    return this.http.put(url, null, {params: {status: request.status ? 'ACTIVE' : 'INACTIVE'}});
  }

  updateBusinessProfile(payload: SaveBusinessProfileRequest) {
    const url = this.buildUrl(`admin/users/${payload.userId}/update-business-profile`);
    const request = omit(payload, ['userId'])
    return this.http.put<ApiResponse<string>>(url, {...request});
  }

  updateBusinessStatus(request: SwitchStatusBusinessRequest) {
    const url = this.buildUrl(`admin/users/${request.userId}/update-bussiness-status`);
    return this.http.put(url, null, {params: {status: request.status ? 'ACTIVE' : 'INACTIVE'}});
  }

  getUserSMTP(userId: number) {
    const url = this.buildUrl(`admin/users/${userId}/smtp`);
    return this.http.get<ApiResponse<any>>(url);
  }

  updateCustomSmtpStatus(userId: number,useCustomSmtp: boolean): Observable<ApiResponse<string>> {
    const params = { useCustomSmtp: String(useCustomSmtp) }; // ⚠️ convert to string
    const url = this.buildUrl(`admin/users/${userId}/updateCustomSMTP`);

    return this.http.put<ApiResponse<string>>(url, null, { params });
  }

  saveSmtpSetting(userId: number,data: SmtpSetting): Observable<ApiResponse<SmtpSetting>> {
    const url = this.buildUrl(`admin/users/${userId}/saveSmtp`);
    return this.http.put<ApiResponse<SmtpSetting>>(url, data);
  }

  testSmtpConnection(data: SmtpSetting): Observable<ApiResponse<SmtpSetting>> {
    const url = this.buildUrl(`admin/users/smtp/testSmtpConnection`);
    return this.http.put<ApiResponse<SmtpSetting>>(url, data);
  }


}
