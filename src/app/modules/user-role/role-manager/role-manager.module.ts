import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleManagerRouting } from '@modules/user-role/role-manager/role-manager.routing';
import { RoleManagerComponent } from '@modules/user-role/role-manager/pages/role-manager.component';
import { SharedModule } from '@shared/shared.module';
import { RoleListComponent } from '@modules/user-role/role-manager/components/role-list/role-list.component';
import { UserInRoleComponent } from '@modules/user-role/role-manager/components/user-in-role/user-in-role.component';
import { RoleManagerStoreModule } from '@modules/user-role/role-manager/state/role-manager-store.module';
import {
  AddNewRoleModalComponent
} from '@modules/user-role/role-manager/components/add-new-role-modal/add-new-role-modal.component';
import {
  AddUserToRoleModalComponent
} from '@modules/user-role/role-manager/components/add-user-to-role-modal/add-user-to-role-modal.component';


const components = [
  RoleManagerComponent,
  RoleListComponent,
  UserInRoleComponent,
  AddNewRoleModalComponent,
  AddUserToRoleModalComponent,
]
@NgModule({
  declarations: components,
  imports: [
    CommonModule,
    SharedModule,
    RoleManagerRouting,
    RoleManagerStoreModule,
  ]
})
export class RoleManagerModule { }
