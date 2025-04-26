import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {UserDTO} from "./admin.dto";
import {ApiResponse} from "@core/models";
import {BaseApiService} from "@core/services/base-api.service";
import {SaveBusinessProfileRequest, SwitchStatusUserRequest} from "../models";
import {omit} from "lodash";


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
    return this.http.put<ApiResponse<string>>(url, {...request, statusBusinessEmail: request.statusBusinessEmail ? 'ACTIVE' : 'INACTIVE'});
  }


  updateBusinessStatus(id: number, userDTO: UserDTO) {
    return this.http.put(`${this.BASE_URL}/users/${id}/business-status`, { userDTO });
  }

}
