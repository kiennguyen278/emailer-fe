import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from '@modules/dashboard/dashboard.component';
import { DashboardRoutes } from '@modules/dashboard/dashboard.routing';



const components = [
  DashboardComponent
];
@NgModule({
  declarations: components,
  imports: [
    CommonModule,
    DashboardRoutes,
  ]
})
export class DashboardModule { }
