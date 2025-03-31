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
