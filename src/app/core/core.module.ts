import { registerLocaleData } from '@angular/common';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import en from '@angular/common/locales/en';
import vi from '@angular/common/locales/vi';
import {
  DEFAULT_CURRENCY_CODE,
  ErrorHandler,
  LOCALE_ID,
  NgModule,
  Optional,
  SkipSelf
} from '@angular/core';
import { environment } from '@environment';
import { NzConfig, NZ_CONFIG } from 'ng-zorro-antd/core/config';
import { MyErrorHandler } from './handler/error.handler';
import { LoadingInterceptor } from './interceptors/loading.interceptor';
import { NotificationService } from './services/notification.service';
import { en_US, NZ_DATE_LOCALE, NZ_I18N, vi_VN } from "ng-zorro-antd/i18n";
import { enUS, vi as viVN } from 'date-fns/locale';
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { BASE_API_URL } from "@core/constants/injection-token.constants";
import { HttpHeaderInterceptor } from '@core/interceptors/http-header.interceptor';
import { AuthInterceptor } from '@core/interceptors';
import { TrimInterceptor } from '@core/interceptors/trim.interceptor';

registerLocaleData(vi);
registerLocaleData(en);

const ngZorroConfig: NzConfig = {
  notification: { nzTop: 60 }
};

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  imports: [
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      defaultLanguage: 'vi'
    })
  ],
  providers: [
    { provide: BASE_API_URL, useValue: environment.baseUrl },
    { provide: HTTP_INTERCEPTORS, useClass: HttpHeaderInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: TrimInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    { provide: ErrorHandler, useClass: MyErrorHandler, deps: [NotificationService ] },
    {
      provide: NZ_I18N,
      useFactory: (localId: string) => {
        switch (localId) {
          case 'vi':
            return vi_VN;
          case 'en':
            return en_US;
          default:
            return vi_VN;
        }
      },
      deps: [LOCALE_ID]
    },
    {
      provide: NZ_DATE_LOCALE,
      useFactory: (localId: string) => {
        switch (localId) {
          case 'vi':
            return viVN;
          case 'en':
            return enUS;
          default:
            return viVN;
        }
      },
      deps: [LOCALE_ID]
    },
    { provide: NZ_CONFIG, useValue: ngZorroConfig },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'VND' }
  ],
  declarations: []
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule?: CoreModule) {
    // Do not allow multiple injections
    if (parentModule) {
      throw new Error(
        'CoreModule has already been loaded. Import this module in the AppModule only.'
      );
    }
  }
}
