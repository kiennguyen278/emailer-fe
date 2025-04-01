import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import {SharedModule} from "../../../shared/shared.module";
import {ZorroAntdModule} from "@shared/zorro-antd.module";
import { NgxEchartsModule } from 'ngx-echarts';


@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    ZorroAntdModule,
    SharedModule,
    HomeRoutingModule,
    NgxEchartsModule
  ]
})
export class HomeModule { }
