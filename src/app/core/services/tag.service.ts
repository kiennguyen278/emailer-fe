// src/app/services/tag.service.ts
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { BaseApiService } from '@core/services/base-api.service';

@Injectable({ providedIn: 'root' })
export class TagService extends BaseApiService {
  private api = this.buildUrl('/tags');

  getOptions(): Observable<{ label: string; value: number }[]> {
    return this.http.get<any>(this.api).pipe(
      map(res => (res.data || []).map((tag: any) => ({
        label: tag.name,
        value: tag.id
      })))
    );
  }
}
