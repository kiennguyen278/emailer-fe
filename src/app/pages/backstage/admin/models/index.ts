

export interface SwitchStatusUserRequest{
  userId: number;
  status: boolean;
}

export interface SaveBusinessProfileRequest{
  userId: number;
  businessName: string;
  businessEmail: string;
  businessDomain: string;
  statusBusinessEmail: boolean
}





