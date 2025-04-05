export type TrendType = 'UP' | 'DOWN' | 'STABLE';

export interface StatItem {
  count: number;
  compare: number;
  trend: TrendType;
}

export interface SubscriberGrowthStats {
  today: StatItem;
  last7Days: StatItem;
  last30Days: StatItem;
  total: StatItem;
}

export interface EmailPerformanceItem {
  userId: number | null;
  workflowId: number | null;
  subscriberId: number | null;
  campaignId: number | null;
  sequenceId: number | null;
  name: string | null;
  createdAt: string | null;
  totalSent: number;
  totalDelivered: number;
  totalOpened: number;
  totalUnopened: number;
  totalClicked: number;
  totalBounced: number;
  totalComplaint: number;
  totalUnsubscribed: number;
  openRate: number;
  unOpenRate: number;
  clickRate: number;
  bounceRate: number;
  complaintRate: number;
  unsubscribeRate: number;
}

export interface EmailPerformanceStats {
  current: EmailPerformanceItem;
  previous: EmailPerformanceItem;
}

export interface EmailTrendItem {
  type: string;              // e.g., "weekly", "daily", "monthly"
  period: string;            // e.g., "2025-13"
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  openRate: number;
  clickRate: number;
  openTrend: TrendType;
  clickTrend: TrendType;
  diffOpenRate: number;
  diffClickRate: number;
}


export interface DashboardSubscriberQuality {
  totalSubscribers: number;
  pendingSubscribers: number;
  activeSubscribers: number;
  inactiveSubscribers: number;
  unsubscribedSubscribers: number;
  unsubscribeRate: number;
  bounceRate: number;
  activeRate: number;
}


export interface PotentialSubscriber {
  userId: number;
  subscriberId: number;
  name: string;
  email: string;
  openCount: number;
  clickCount: number;
  engagementScore: number;
}


export interface EmailEngagement {
  userId: number;

  // in sequence
  sequenceId: number | null;
  sequenceName: string | null;
  sequenceStepId: number | null;

  // in campaign
  campaignId: number | null;
  campaignName: string | null;

  subject: string;

  openCount: number;
  clickCount: number;
  engagementScore: number;
}


