import {ValidatorUtil} from "@core/utils/validator.util";

export interface EmailTemplateDTO {
  id: number;
  name: string;
  subject: string;
  type: 'html' | 'text';
  content: string;
  status: 'active' | 'inactive';
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


















