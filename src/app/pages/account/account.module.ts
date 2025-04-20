import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AccountRoutingModule } from './account-routing.module';
import {SharedModule} from "../../shared/shared.module";
import {AuthService} from "@core/services/auth.service";
import { VerifyEmailResultComponent } from './verify-email-result/verify-email-result.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    SharedModule,
    AccountRoutingModule,
  ],
  declarations: [
    LoginComponent,
    VerifyEmailResultComponent
  ],
  providers: [
    AuthService
  ]
})
export class AccountModule { }
