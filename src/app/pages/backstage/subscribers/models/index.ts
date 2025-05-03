
export interface SaveTagRequest {
  id?: number;
  name: string;
}


export interface TagDTO {
  id: number;
  name: string;
  userId?: number;
}


export interface SubscriberSearchDTO {
  keyword?: string
  tagId?: string
  page: number
  size: number
  sort?: string
}

export interface SubscriberDTO {
  id: number,
  userId: number,
  email: string,
  firstName: string,
  sourceType: string,
  lastName: string | null | any,
  status: "ACTIVE" | "INACTIVE",
  createdAt: string,
}

export interface CampaignSubscriberEmail {
  campaignId: number;
  campaignName: string;

  subscriberId: number;
  subscriberEmail: string;
  firstName?: string;
  lastName?: string;

  subject?: string;
  status?: string;
  emailSentTime?: string; // ISO string dạng "2025-03-30T20:56:00"
}



export interface SubscriberResponseDTO {
  content: SubscriberDTO[],
  totalElements: number
  totalPages: number
}


export interface SaveSubscriberRequest {
  id?: number;
  email: string;
  firstName: string;
  lastName?: string;
  tagIds: number[];
}

export interface EmailLog {
  id: string;
  status: string;
  subject: string;
  email: string;
  subscriberId: string;
  campaignId: string;
  sequenceId: string;
  createdAt: string;
  openedAt: string;
  clickedAt: string;
}

export interface EmailStatsDTO {
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

export interface SubscriberDetailDTO {
  status: string;
  userId: number;
  subscriberId: number;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  tags: TagDTO[];
  emailHistorys: EmailLog[];
  campaigns: SubscriberCampaignDTO[];
  sequences: SubscriberSequenceDTO[];
  stats: EmailStatsDTO;
}

export interface SubscriberCampaignDTO {
  campaignId: number;
  name: string;
  subject: string;
  status: string; // 'DRAFT' | 'SCHEDULED' | 'SENT' | 'CANCELLED'
  scheduledTime: string; // ISO 8601 format
  campaignCreatedAt: string;
  sentTimeToSubscriber: string;
}

export interface SubscriberSequenceDTO {
  sequenceId: number;
  sequenceName: string;
  sequenceStatus: 'ACTIVE' | 'INACTIVE';
}

export interface SubscriberStatsDTO {
  totalSubscribers: number;
  pendingSubscribers: number;
  activeSubscribers: number;
  inactiveSubscribers: number;
  unsubscribedSubscribers: number;
  bouncedSubscribers: number;
  unsubscribeRate: number;
  bounceRate: number;
  activeRate: number;
}
