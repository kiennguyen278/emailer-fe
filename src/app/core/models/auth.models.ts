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
