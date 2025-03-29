


export interface GetListUserRequest{
  params: {
    page: number,
    size: number,
  },
  body: {
    userName?: string,
    fullName?: string,
    status?: number,
    phoneNumber?: string,
    email?: string,
  }
}

export interface ItemUser{
  id: number,
  userName: string,
  roles: string[],
  status: number,
  code: string,
  fullName: string,
  phoneNumber: string,
  email: string,
}

export interface GetListUserResponsed{
  content: ItemUser[],
  totalElements: number
}


export interface SaveUserRequest{
  id?: number,
  userName: string,
  lstRoleCode: string[],
  status?: number,
  code: string,
  fullName: string,
  phoneNumber: string,
  email: string,
}


export interface RoleUser{
  roleCode: string,
  roleName: string,
}
export interface UserDetailResponsed{
  user: ItemUser,
  roles: RoleUser[]
}











