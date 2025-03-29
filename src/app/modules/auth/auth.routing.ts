import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '@modules/auth/pages/login/login.component';
import { CanDeactiveGuard } from '@core/guards/can-deactive';


const routes: Routes = [
  // { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent,
    // canDeactivate: [CanDeactiveGuard],
    data: {
      title: 'Login'
    }
  },
];

export const AuthRouting = RouterModule.forChild(routes);
