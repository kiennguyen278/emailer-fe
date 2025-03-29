import { ResponseErrorModel } from './response-error.model';

export interface ResponsePagination<T = any> {
  error: ResponseErrorModel;
  data: T[];
  totalRecord: number;
}
