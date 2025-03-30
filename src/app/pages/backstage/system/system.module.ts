import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SystemRoutingModule } from './system-routing.module';
import { HomeComponent } from './home/home.component';
import { UsersComponent } from './users/users.component';
import {SharedModule} from "../../../shared/shared.module";


@NgModule({
  imports: [
    CommonModule,
    SystemRoutingModule,
  ],
  declarations: [HomeComponent, UsersComponent]
})
export class SystemModule { }
