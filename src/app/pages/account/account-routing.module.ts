import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { VerifyEmailResultComponent } from './verify-email-result/verify-email-result.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'verify-email-result', component: VerifyEmailResultComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
