export interface SmtpSetting {
  provider: string;
  smtpServer: string;
  smtpPort: number;
  username: string;
  password: string;
  type: 'CUSTOM' | 'SYSTEM';
}

export interface UserDTO {
  userId: number | null;
  status: 'ACTIVE' | 'INACTIVE' | null;
  oldPassword: string | null;
  newPassword: string | null;

  businessName: string | null;
  businessEmail: string | null;
  businessDomain: string | null;
  isVerified: boolean | null;
}
