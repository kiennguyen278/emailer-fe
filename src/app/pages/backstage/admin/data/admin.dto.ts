
export interface UserDTO {
  userId?: number;
  email?: string;
  status?: 'PENDING' | 'ACTIVE' | 'INACTIVE'; // Trạng thái người dùng
  role?: 'USER' | 'ADMIN'; // Vai trò của người dùng

  businessName?: string;
  businessEmail?: string;
  businessDomain?: string;
  isVerified?: boolean; // true | false
  useCustomSmtp?: boolean; // true | false

}


export interface BusinessInfoDTO {
  businessName?: string;
  businessEmail?: string;
  businessDomain?: string;
  isVerified?: boolean;
  useCustomSmtp?: boolean;
}

