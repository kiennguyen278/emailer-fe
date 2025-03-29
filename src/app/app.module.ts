import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutes } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from "@core/core.module";
import { SharedModule } from '@shared/shared.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthLayoutComponent } from '@layout/auth-layout/auth-layout.component';
import { ContentLayoutComponent } from './layout/content-layout/content-layout.component';
import { StoreModule } from '@ngrx/store';
import { sidebarFeatureKey, SidebarReducer } from './state/sidebar/reducer';
import { CanDeactiveGuard } from '@core/guards/can-deactive';
import { EffectsModule } from '@ngrx/effects';
import { TokenStorageService } from '@modules/auth/service/token-storage.service';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '@environment';
import { PermissionService } from '@core/services/permission.service';

@NgModule({
  declarations: [
    AppComponent,
    AuthLayoutComponent,
    ContentLayoutComponent,
  ],
  imports: [
    BrowserModule,
    CoreModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SharedModule,
    AppRoutes,
    StoreModule.forRoot({
      [sidebarFeatureKey]: SidebarReducer
    }),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
      autoPause: true
    }),
  ],
  providers: [
    CanDeactiveGuard,
    TokenStorageService,
    PermissionService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

