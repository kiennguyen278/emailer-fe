import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NgZorroAntdModule} from './ng-zorro-antd.module';
import {NZ_I18N, en_US} from 'ng-zorro-antd/i18n';
import {FormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {registerLocaleData, CommonModule} from '@angular/common';
import en from '@angular/common/locales/en';
import {RouteReuseStrategy} from '@angular/router';
import {AppReuseStrategy} from './services/core/app-reuse-strategy';
import {SharedCoreModule} from './services/core/shared-core-module';
import {ComponentCoreModule} from './components/component-core.module';

// import { BackstageTopBannerModule as BackstageLayoutModule } from './layouts/backstage-topbanner/backstage-topbanner.module';
import {BackstageDefaultModule as BackstageLayoutModule} from './layouts/backstage-default/backstage-default.module';
import {SettingsModule} from './pages/backstage/settings/settings.module';
import {WorkflowsModule} from './pages/backstage/workflows/workflows.module';
import {EmailModule} from './pages/backstage/email/email.module';
import {SubscribersModule} from './pages/backstage/subscribers/subscribers.module';
import {HomeModule} from './pages/backstage/home/home.module';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
  ],
  bootstrap: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgZorroAntdModule,
    FormsModule,
    BrowserAnimationsModule,
    BackstageLayoutModule,
    ComponentCoreModule.forRoot(),
    SharedCoreModule.forRoot(),
    SettingsModule,
    WorkflowsModule,
    EmailModule,
    SubscribersModule,
    HomeModule],
  providers: [
    {provide: NZ_I18N, useValue: en_US},
    {provide: RouteReuseStrategy, useClass: AppReuseStrategy},
    provideHttpClient(withInterceptorsFromDi()),
  ]
})
export class AppModule {
}
