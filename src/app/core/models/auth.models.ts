export interface LoginRequest {
  email: string,
  password: string,
}

export interface LoginResponsed {
  success: boolean,
  message: string,
  data: {
    accessToken: string,
    refreshToken: string,
  }
}


export interface UserInfo {
  userId: 1,
  email: string,
  status: "ACTIVE" | "INACTIVE",
  role: "USER" | "ADMIN",
  createdAt: string,
  businessName: string,
  businessEmail: string,
  businessDomain: string,
  isVerified: boolean
}

export interface AuthResponse {
  loginResponse: LoginResponsed;
  userInfo: UserInfo;
}
