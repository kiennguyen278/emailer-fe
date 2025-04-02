export interface SmtpSetting {
  provider: string;
  smtpServer: string;
  smtpPort: number;
  username: string;
  password: string;
}

export interface BusinessInfo {
  businessName: string;
  businessEmail: string;
  businessDomain: string;
  isVerified?: boolean; // trạng thái xác minh email
  useCustomSmtp?: boolean;
}

export interface PasswordChange {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}
