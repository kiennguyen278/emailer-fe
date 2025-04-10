
export interface UserDTO {
  id?: number;
  email?: string;
  status?: string; // Trạng thái người dùng 'PENDING' | 'ACTIVE' | 'INACTIVE'
  role?: 'USER' | 'ADMIN'; // Vai trò của người dùng

  businessEmail?: string;
  businessName?: string;
  domain?: string;
  statusBusinessEmail?: string;
  useCustomSmtp?: boolean; // true | false

  createdAt?: string;

}
