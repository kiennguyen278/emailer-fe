import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AuthRouting } from '@modules/auth/auth.routing';
import { LoginComponent } from '@modules/auth/pages/login/login.component';
import { ZorroAntdModule } from '@shared/zorro-antd.module';
import { AuthService } from '@modules/auth/service/auth.service';



const components = [
  LoginComponent,
];

@NgModule({
  declarations: components,
  imports: [
    CommonModule,
    AuthRouting,
    SharedModule,
    TranslateModule,
    ZorroAntdModule,
    ReactiveFormsModule
  ],
  providers: [
    AuthService,
  ]
})
export class AuthModule { }
