import { Routes, RouterModule } from '@angular/router';
import { RoleManagerComponent } from '@modules/user-role/role-manager/pages/role-manager.component';

const routes: Routes = [
  {
    path: '',
    component: RoleManagerComponent,
    data: {
      // icon: 'tag-user',
      title: 'Vai trò',
      breadcrumb: 'Vai trò',
    }
  },
];

export const RoleManagerRouting = RouterModule.forChild(routes);
