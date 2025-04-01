import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import * as echarts from 'echarts';

import { FormsModule } from '@angular/forms';

import {HomeRoutingModule} from './home-routing.module';
import {DashboardComponent} from './dashboard/dashboard.component';
import {SharedModule} from '../../../shared/shared.module';
import {NgxEchartsModule} from 'ngx-echarts';
import { NzIconModule } from 'ng-zorro-antd/icon'; // ✅ thêm dòng này
import {ZorroAntdModule} from '../../../shared/zorro-antd.module';



@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    FormsModule,
    ZorroAntdModule,
    SharedModule,
    HomeRoutingModule,
    NgxEchartsModule.forRoot({ echarts }),
    NzIconModule // ✅ THÊM VÀO ĐÂY
  ]
})
export class HomeModule { }
