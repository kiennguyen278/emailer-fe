import { BrowserModule } from '@angular/platform-browser';
import { NgModule, isDevMode } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData, CommonModule } from '@angular/common';
import en from '@angular/common/locales/en';
import { RouteReuseStrategy } from '@angular/router';
import { AppReuseStrategy } from './services/core/app-reuse-strategy';
import { SharedCoreModule } from './services/core/shared-core-module';
import { BackstageDefaultModule as BackstageLayoutModule } from './layouts/backstage-default/backstage-default.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import {AuthLayoutComponent} from "./layouts/auth-layout/auth-layout.component";
import {SharedModule} from "./shared/shared.module";
import {CoreModule} from "@core/core.module";
import {globalbarFeatureKey, SidebarReducer} from "./state/sidebar/reducer";
import {metaReducers} from "./state/sidebar/meta-reducers";
import { AdminModule } from './pages/backstage/admin/admin.module';
import {TokenStorageService} from "@core/services/token-storage.service";
import {PermissionService} from "@core/services/permission.service";

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    AuthLayoutComponent,
  ],
  imports: [
    BrowserModule,
    CoreModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    BackstageLayoutModule,
    SharedModule,
    SharedCoreModule.forRoot(),
    StoreModule.forRoot({[globalbarFeatureKey]: SidebarReducer}, { metaReducers }),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
    AdminModule,
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    { provide: RouteReuseStrategy, useClass: AppReuseStrategy },
    TokenStorageService,
    PermissionService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
