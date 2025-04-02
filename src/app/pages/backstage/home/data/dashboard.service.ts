import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {BaseApiService} from "@core/services/base-api.service";
import {ApiResponse} from "@core/models/response.model";

import {
  SubscriberGrowthStats,
  EmailPerformanceStats,
  EmailTrendItem,
  PotentialSubscriber,
  EmailEngagement,
  DashboardSubscriberQuality
} from './dashboard.models';
import {DateUtil} from "@core/utils/date.util";
import {HttpParams} from "@angular/common/http";

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
  getEmailPerformance(period: string): Observable<ApiResponse<EmailPerformanceStats>> {
    const params = new HttpParams()
      .set('period', period);
    return this.http.get<ApiResponse<EmailPerformanceStats>>(`${this.BASE_URL}/email-performance`, { params });
  }

  /**
   * Lấy xu hướng email ( 7d|30d|12w)
   */
  getEmailTrend(period: string): Observable<ApiResponse<EmailTrendItem[]>> {
    const params = new HttpParams()
      .set('period', period);
    return this.http.get<ApiResponse<EmailTrendItem[]>>(`${this.BASE_URL}/email-trend`, { params });
  }

  /**
   * top Subscriber có tương tác tốt
   */
  getPotentialSubscribers(period: string): Observable<ApiResponse<PotentialSubscriber[]>> {
    const params = new HttpParams()
      .set('period', period);
    return this.http.get<ApiResponse<PotentialSubscriber[]>>(
      `${this.BASE_URL}//top-potential-subscribers`, { params }
    );
  }

  /**
   * top email có tương tác tốt
   */
  getEmailEngagementReport(period: string): Observable<ApiResponse<EmailEngagement[]>> {
    const params = new HttpParams()
      .set('period', period);
    return this.http.get<ApiResponse<EmailEngagement[]>>(
      `${this.BASE_URL}/top-email-engagement`, { params }
    );
  }

  getSubscriberQuality(period: string): Observable<ApiResponse<DashboardSubscriberQuality>> {
    const params = new HttpParams()
      .set('period', period);
    return this.http.get<ApiResponse<DashboardSubscriberQuality>>(`${this.BASE_URL}/subscriber-quality`, { params });
  }
}
