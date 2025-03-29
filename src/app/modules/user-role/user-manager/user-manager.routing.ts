import { Routes, RouterModule } from '@angular/router';
import { UserManagerComponent } from '@modules/user-role/user-manager/pages/user-manager.component';

const routes: Routes = [
  // { path: '', redirectTo: 'role-manager', pathMatch: 'full' },
  {
    path: '',
    component: UserManagerComponent,
    data: {
      // icon: 'tag-user',
      title: 'Người dùng và quyền',
      breadcrumb: 'Người dùng và quyền',
    }
  },
];

export const UserManagerRouting = RouterModule.forChild(routes);
