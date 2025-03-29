import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'user-manager', pathMatch: 'full' },
  {
    path: 'user-manager',
    loadChildren: () => import('@modules/user-role/user-manager/user-manager.module').then((m) => m.UserManagerModule),
    data: {
      title: 'Người dùng và quyền',
      breadcrumb: 'Quản lý người dùng',
    }
  },
  {
    path: 'role-manager',
    loadChildren: () => import('@modules/user-role/role-manager/role-manager.module').then((m) => m.RoleManagerModule),
    data: {
      title: 'Vai trò',
      breadcrumb: 'Quản lý vai trò',
    }
  },
];

export const UserRoleRouting = RouterModule.forChild(routes);
