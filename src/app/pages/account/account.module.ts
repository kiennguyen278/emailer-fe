import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { NgZorroAntdModule } from '../../ng-zorro-antd.module';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AccountRoutingModule } from './account-routing.module';

@NgModule({ declarations: [LoginComponent], imports: [CommonModule,
        FormsModule,
        NgZorroAntdModule,
        AccountRoutingModule], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class AccountModule { }
