import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardService {

  getSubscriberGrowth(): Observable<any> {
    return of({
      success: true,
      message: 'Subscriber growth statistics',
      data: {
        today: {
          count: 0,
          compare: 0,
          trend: 'STABLE'
        },
        last7Days: {
          count: 0,
          compare: 0,
          trend: 'STABLE'
        },
        last30Days: {
          count: 3,
          compare: 3,
          trend: 'UP'
        },
        total: {
          count: 3,
          compare: 0,
          trend: 'STABLE'
        }
      }
    });
  }

  getEmailPerformance(): Observable<any> {
    return of({
      success: true,
      message: 'Email performance statistics',
      data: {
        current: {
          userId: null,
          workflowId: null,
          subscriberId: null,
          campaignId: null,
          sequenceId: null,
          name: null,
          createdAt: null,
          totalSent: 18,
          totalDelivered: 18,
          totalOpened: 7,
          totalUnopened: 0,
          totalClicked: 5,
          totalBounced: 0,
          totalComplaint: 0,
          totalUnsubscribed: 0,
          openRate: 38.89,
          unOpenRate: 0.0,
          clickRate: 27.78,
          bounceRate: 0.0,
          complaintRate: 0.0,
          unsubscribeRate: 0.0
        },
        previous: {
          userId: null,
          workflowId: null,
          subscriberId: null,
          campaignId: null,
          sequenceId: null,
          name: null,
          createdAt: null,
          totalSent: 3,
          totalDelivered: 3,
          totalOpened: 0,
          totalUnopened: 0,
          totalClicked: 1,
          totalBounced: 0,
          totalComplaint: 0,
          totalUnsubscribed: 0,
          openRate: 0.0,
          unOpenRate: 0.0,
          clickRate: 33.33,
          bounceRate: 0.0,
          complaintRate: 0.0,
          unsubscribeRate: 0.0
        }
      }
    });
  }

  getEmailTrend(): Observable<any> {
    return of({
      success: true,
      message: 'Email trend weekly',
      data: [
        {
          type: 'weekly',
          period: '2025-12',
          sent: 3,
          delivered: 3,
          opened: 0,
          clicked: 1,
          openRate: 0.0,
          clickRate: 33.33,
          openTrend: 'STABLE',
          clickTrend: 'STABLE',
          diffOpenRate: 0.0,
          diffClickRate: 0.0
        },
        {
          type: 'weekly',
          period: '2025-13',
          sent: 18,
          delivered: 18,
          opened: 7,
          clicked: 5,
          openRate: 38.89,
          clickRate: 27.78,
          openTrend: 'UP',
          clickTrend: 'DOWN',
          diffOpenRate: 38.89,
          diffClickRate: -5.55
        }
      ]
    });
  }

}
