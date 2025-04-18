import {CampaignSubscriberEmail, SubscriberDTO} from "../../subscribers/models";

export interface EmailTemplateDTO {
  id: number;
  name: string;
  subject: string;
  type: 'HTML' | 'TEXT';
  htmlBody: string;
  textBody: string;
  status: 'ACTIVE' | 'INACTIVE';
  activeStatus?: boolean;
  createdAt: string;
  updatedAt: string;
}


export interface SaveEmailTemplateRequest {
  id: number | null | undefined,
  name: string,
  type: string,
  subject: string,
  htmlBody: string,
  textBody: string,
}

export interface EmailCampaignDTO {
  id: number,
  userId: number,
  name: string,
  description: string,
  status: string,
  subject: string,
  htmlBody: string,
  textBody: string,
  scheduledTime: string,
  createdAt: string,
  updatedAt: string
}

export interface SaveEmailCampaignRequest {
  id: number | null | undefined,
  name: string,
  subject: string,
  scheduledTime: string,
  tagIds: number[] | string[],
  subscriberIds: number[] | string[],
  htmlBody: string,
}


export interface CampaignDetailDTO {
  userId: number;
  name: string;
  scheduledTime: string;
  status: string;
  subject: string;
  htmlBody: string;
  textBody: string;
  stats: {
    userId: number;
    workflowId: number;
    subscriberId: number;
    campaignId: number;
    sequenceId: number;
    name: string;
    createdAt: string;
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
  },
  subscribers: CampaignSubscriberEmail[];
}

export interface SequenceDTO {
  id: number,
  userId: number,
  name: string,
  description: string,
  status: string,
  activeStatus?: boolean,
  createdAt: string,
  updatedAt: string
}


export interface SaveSequenceRequest {
  id: number | null | undefined,
  name: string,
  description: string,
}

export interface SaveStepSequenceRequest {
  id: number | null | undefined, // id của step - khi cập nhật step sẽ dùng cái này
  sequenceId: number | null | undefined, // id của sequence - khi tạo mới step sẽ dùng cái này
  subject: string,
  htmlBody: string,
  delayDays: string | number,
}


export interface SaveCombineSequenceRequest {
  info: SaveSequenceRequest;
  steps: SaveStepSequenceRequest;
}

export interface SaveCombineSequenceResponse {
  info: SequenceDTO;
  step: StepSequenceDTO;
}



export interface StepSequenceDTO {
  id: number;
  userId: number;
  sequenceId: number;
  templateId: number;
  subject: string;
  htmlBody: string;
  textBody: string;
  delayDays: string | number;
  position: string | number;
  createdAt: string;
}

export interface ReOrderStepsSequenceRequest {
  stepIds: number[];
  sequenceId: number
}


export interface SwitchStatusSequenceRequest{
  id: number;
  status: boolean;
}

export interface SwitchStatusTemplateRequest{
  id: number;
  status: boolean;
}


