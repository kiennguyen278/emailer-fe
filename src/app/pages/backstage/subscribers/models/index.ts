
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
  lastName: string | null | any,
  status: "ACTIVE" | "INACTIVE",
  createdAt: string
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
  status: string;
  subject: string;
  createdAt: string;
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
  tags: TagDTO[];
  emailHistorys: EmailLog[];
  stats: EmailStatsDTO;
}
