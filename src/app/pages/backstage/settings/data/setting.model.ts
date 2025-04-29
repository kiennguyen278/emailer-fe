export interface SmtpSetting {
  provider: string;
  smtpServer: string;
  smtpPort: number;
  username: string;
  password: string;

  isActive?: boolean;
  isDefault?: boolean;
  lastTestResult?: string;
  lastTestedAt?: string;
  createdAt?: string;
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

export interface IntegrationSettingDTO {
  id?: number;
  userId?: number;
  systemName: string;
  endpointUrl: string;
  username?: string;
  password?: string; // chỉ khi tạo/sửa mới gửi
  apiKey?: string;
  sourceType: 'KNACK' | 'CONVERTKIT' | 'OTHER';
  status: 'ACTIVE' | 'INACTIVE';
  lastPullAt?: string;
}

