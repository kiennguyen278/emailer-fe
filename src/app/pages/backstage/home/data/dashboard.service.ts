import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {BaseApiService} from "@core/services/base-api.service";
import {ApiResponse} from "@core/models/response.model";

import {
  SubscriberGrowthStats,
  EmailPerformanceStats,
  EmailTrendItem
} from './dashboard.models';

@Injectable({ providedIn: 'root' })
export class DashboardService extends BaseApiService {
  private readonly BASE_URL = this.buildUrl('/dashboard');

  /**
   * Lấy thống kê tăng trưởng subscriber
   */
  getSubscriberGrowth(): Observable<ApiResponse<SubscriberGrowthStats>> {
    return this.http.get<ApiResponse<SubscriberGrowthStats>>(`${this.BASE_URL}/subscriber-growth`);
  }

  /**
   * Lấy hiệu suất email (so sánh kỳ hiện tại và kỳ trước)
   */
  getEmailPerformance(): Observable<ApiResponse<EmailPerformanceStats>> {
    return this.http.get<ApiResponse<EmailPerformanceStats>>(`${this.BASE_URL}/email-performance`);
  }

  /**
   * Lấy xu hướng email ( 7d|30d|90d)
   */
  getEmailTrend(): Observable<ApiResponse<EmailTrendItem[]>> {
    return this.http.get<ApiResponse<EmailTrendItem[]>>(`${this.BASE_URL}/email-trend`);
  }
}
