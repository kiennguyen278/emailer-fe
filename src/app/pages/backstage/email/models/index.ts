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
