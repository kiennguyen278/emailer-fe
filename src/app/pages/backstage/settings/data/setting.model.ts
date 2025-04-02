export interface SmtpSetting {
  provider: string;
  smtpServer: string;
  smtpPort: number;
  username: string;
  password: string;
  type: 'CUSTOM' | 'SYSTEM';
}

export interface UserDTO {
  userId?: number;
  status?: 'ACTIVE' | 'INACTIVE';
  oldPassword?: string;
  newPassword?: string;

  businessName?: string;
  businessEmail?: string;
  businessDomain?: string;
  isVerified?: boolean;
}
