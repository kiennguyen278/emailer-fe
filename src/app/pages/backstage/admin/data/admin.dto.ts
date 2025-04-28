import {Role} from "@core/enums";

export interface UserDTO {
  id?: number;
  email?: string;
  status?: string; // Trạng thái người dùng 'PENDING' | 'ACTIVE' | 'INACTIVE'|'LOCKED'
  role?: Role.USER | Role.ADMIN; // Vai trò của người dùng

  businessEmail?: string;
  businessName?: string;
  domain?: string;
  statusBusinessEmail?: string;
  useCustomSmtp?: boolean; // true | false
  activeStatus?: boolean; // true | false

  createdAt?: string;
}

export interface GeneralSettings {
  systemName: string;
  systemEmail: string;
  enableDefaultSmtp: boolean;
  enabledSending: boolean;
  timeZone: string;
}

