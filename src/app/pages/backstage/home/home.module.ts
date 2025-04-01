import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import * as echarts from 'echarts';

import {HomeRoutingModule} from './home-routing.module';
import {DashboardComponent} from './dashboard/dashboard.component';
import {SharedModule} from '../../../shared/shared.module';
import {NgxEchartsModule} from 'ngx-echarts';

import {ZorroAntdModule} from '../../../shared/zorro-antd.module';
import {NzIconModule} from 'ng-zorro-antd/icon'; // ✅ vẫn giữ lại


@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    ZorroAntdModule,
    SharedModule,
    HomeRoutingModule,
    NgxEchartsModule.forRoot({ echarts }),
    NzIconModule // ✅ THÊM VÀO ĐÂY
  ]
})
export class HomeModule { }
