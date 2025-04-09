import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {BaseApiService} from "@core/services/base-api.service";
import {UserDTO} from "./admin.dto";
import {ApiResponse} from "@core/models";

@Injectable({
  providedIn: 'root'
})
export class AdminService extends BaseApiService {

  private readonly BASE_URL = this.buildUrl('/admin');


  /**
   * Lấy thông tin người dùng
   */
  getUserProfile(userId: number): Observable<ApiResponse<UserDTO>> {
    return this.http.get<ApiResponse<UserDTO>>(`${this.BASE_URL}/users/${userId}`);
  }

  /**
   * Tìm kiếm người dùng với các tham số lọc
   * @param email - Email người dùng
   * @param status - Trạng thái người dùng
   * @param businessEmailStatus - Trạng thái email doanh nghiệp
   * @param page - Trang tìm kiếm
   * @param size - Kích thước trang
   * @returns Observable chứa danh sách người dùng
   */
  searchUsers(
    email: string | null,
    status: 'ACTIVE' | 'PENDING' | 'INACTIVE' | null,
    page: number = 0,
    size: number = 10
  ): Observable<ApiResponse<any>> {
    // Xây dựng params (query string)
    const params: any = {
      email: email || '', // Nếu email null, thì gán là chuỗi rỗng
      status: status || '', // Nếu status null, thì gán là chuỗi rỗng
      businessEmailStatus: '', // Nếu businessEmailStatus null, thì gán là chuỗi rỗng
      page: page.toString(),
      size: size.toString()
    };

    // Gửi request GET với query string được cấu hình
    return this.http.get<ApiResponse<any>>(`${this.BASE_URL}/users/search`, { params });
  }

  /**
   * Đăng ký người dùng mới
   */
  registerUser(userDTO: UserDTO): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.BASE_URL}/users/register`, userDTO, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

}
