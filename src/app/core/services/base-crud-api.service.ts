import { ResponseModel, ResponsePagination } from '@core/models';
import { BaseApiService } from './base-api.service';

export abstract class BaseCrudApiService<T = any> extends BaseApiService {
  create(body: any) {
    return this.http.post<ResponseModel<T>>(this.buildUrl(), body);
  }

  find(params: any) {
    return this.http.get<ResponsePagination<T>>(this.buildUrl(), { params });
  }

  findOne(id: string) {
    return this.http.get<ResponseModel<T>>(this.buildUrl(id));
  }

  update(id: string, body: any) {
    return this.http.put<ResponseModel<T>>(this.buildUrl(), { id, ...body });
  }

  delete(id: string) {
    return this.http.delete<ResponseModel<T>>(this.buildUrl(id));
  }
}
