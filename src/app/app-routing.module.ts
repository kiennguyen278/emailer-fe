import { RouterModule, Routes } from '@angular/router';
import { AuthLayoutComponent } from '@layout/auth-layout/auth-layout.component';
import { ContentLayoutComponent } from '@layout/content-layout/content-layout.component';
import { AuthGuard } from '@core/guards';
import { LoginAuthGuard } from '@core/guards/login-auth.guard';
import { PermissionService } from '@core/services/permission.service';
import { RoleUser } from '@core/enums';

const routes: Routes = [
  {
    path: '',
    component: ContentLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadChildren: () => import('@modules/dashboard/dashboard.module').then((m) => m.DashboardModule)
      },

      {
        path: 'user-role',
        loadChildren: () => import('@modules/user-role/user-role.module').then((m) => m.UserRoleModule),
        data: {
          title: 'Người dùng và quyền',
          breadcrumb: 'Người dùng và quyền',
          permissions: {
            allow: [RoleUser.ADMIN],
          }
        },
        canActivate: [PermissionService]
      },
    ]
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    loadChildren: () => import('@modules/auth/auth.module').then((m) => m.AuthModule),
    canActivate: [LoginAuthGuard],
  },

];


export const AppRoutes = RouterModule.forRoot(routes, {
  paramsInheritanceStrategy: 'always'
});
