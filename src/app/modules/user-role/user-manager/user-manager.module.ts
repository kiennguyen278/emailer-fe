import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserManagerRouting } from '@modules/user-role/user-manager/user-manager.routing';
import { UserManagerComponent } from '@modules/user-role/user-manager/pages/user-manager.component';
import { SharedModule } from '@shared/shared.module';
import {
  AddNewUserModalComponent
} from '@modules/user-role/user-manager/components/add-new-user-modal/add-new-user-modal.component';
import { UserManagerStoreModule } from '@modules/user-role/user-manager/state/user-manager-store.module';


const components = [
  UserManagerComponent,
  AddNewUserModalComponent,
]

@NgModule({
  declarations: components,
  imports: [
    CommonModule,
    SharedModule,
    UserManagerRouting,
    UserManagerStoreModule,
  ]
})
export class UserManagerModule { }
