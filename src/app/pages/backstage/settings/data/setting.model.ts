export interface BusinessSetting {
  bizName: string;
  bizEmail: string;
  isVerified?: boolean; // trạng thái xác minh email
}

export interface SmtpSetting {
  provider: string;
  smtpServer: string;
  smtpPort: number;
  username: string;
  password: string;
  type: 'CUSTOM' | 'SYSTEM';
}

export interface PasswordChange {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}
