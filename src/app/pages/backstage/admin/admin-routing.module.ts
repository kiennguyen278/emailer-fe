// admin-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { UsersComponent } from './users/users.component'; // Import UsersComponent

const routes: Routes = [
  { path: '', component: MainComponent, data: { title: 'Admin', reuse: true } },
  { path: 'users', component: UsersComponent, data: { title: 'Admin/Users' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
