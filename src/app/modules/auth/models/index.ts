import { ItemUser } from '@modules/user-role/user-manager/models';
import { ItemRole } from '@modules/user-role/role-manager/models';


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



export interface ChangePasswordRequest{
  userName: string,
  password: string,
  oldPassword: string,
}







