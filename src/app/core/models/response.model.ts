import { ResponseErrorModel } from './response-error.model';

export interface ResponseModel<T = any> {
  error: ResponseErrorModel;
  data: T;
  totalRecord: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
