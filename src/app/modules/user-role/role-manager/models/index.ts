
export interface GetListRoleRequest{
  page: number,
  size: number,
  status?: number,
  keyword?: string
}


export interface ItemRole{
  description: string,
  id: number,
  roleCode: string,
  roleName: string,
  status: number,
}

export interface GetListRoleResponsed{
  content: ItemRole[],
  totalElements: number,
}


export interface SaveRoleItemRequest{
  id?: number,
  roleCode: string,
  roleName: string,
  status?: number,
  description: string
}




export interface GetListUserInRoleRequest{
  page: number,
  size: number,
  roleCode: string
}

export interface GetListUserAddToRoleRequest{
  roleCode: string
}


export interface AddUserToRoleRequest{
  lstUsername: string[],
  roleCode: string
}

export interface DeleteUserFromRoleRequest{
  userName: string,
  roleCode: string
}





