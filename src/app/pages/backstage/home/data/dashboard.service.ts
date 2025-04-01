import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardService {

  getSubscriberGrowth(): Observable<any> {
    return of({
      today: { count: 1, compare: 0, trend: 'STABLE' },
      last7Days: { count: 9, compare: 0, trend: 'STABLE' },
      last30Days: { count: 30, compare: 3, trend: 'UP' },
      total: { count: 100, compare: 0, trend: 'STABLE' }
    });
  }

  getEmailPerformance(): Observable<any> {
    return of({
      totalSent: 18,
      openRate: 38.89,
      clickRate: 27.78
    });
  }

  getEmailTrend(): Observable<any[]> {
    return of([
      {
        type: 'weekly',
        period: '2025-12',
        sent: 3,
        delivered: 3,
        opened: 0,
        clicked: 1,
        openRate: 0.0,
        clickRate: 33.33
      },
      {
        type: 'weekly',
        period: '2025-13',
        sent: 18,
        delivered: 18,
        opened: 7,
        clicked: 5,
        openRate: 38.89,
        clickRate: 27.78
      }
    ]);
  }
}
