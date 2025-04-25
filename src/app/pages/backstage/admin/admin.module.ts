import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AdminRoutingModule } from './admin-routing.module';
import { MainComponent } from './main/main.component';
import { UsersComponent } from './users/users.component';

import { SharedModule } from 'src/app/shared/shared.module';
import {UserDetailModalComponent} from "./users/components/user-detail-modal/user-detail-modal.component";



@NgModule({
  declarations: [
    MainComponent,
    UsersComponent,
    UserDetailModalComponent,
  ],
  // exports: [
  //   UserDetailModalComponent
  // ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AdminRoutingModule,
    SharedModule
  ]
})
export class AdminModule { }
