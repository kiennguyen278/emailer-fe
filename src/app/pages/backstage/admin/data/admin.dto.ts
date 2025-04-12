import {Role} from "@core/enums";

export interface UserDTO {
  id?: number;
  email?: string;
  status?: string; // Trạng thái người dùng 'PENDING' | 'ACTIVE' | 'INACTIVE'
  role?: Role.USER | Role.ADMIN; // Vai trò của người dùng

  businessEmail?: string;
  businessName?: string;
  domain?: string;
  statusBusinessEmail?: string;
  useCustomSmtp?: boolean; // true | false

  createdAt?: string;

}
