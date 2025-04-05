import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import {SubscriberComponent} from "./pages/subscriber/subscriber.component";
import {TagComponent} from "./pages/tag/tag.component";
import {SubscribersRoutingModule} from "./subscribers-routing.module";
import {SubscribersStoreModule} from "./state/subscribers-store.module";
import { NgxEchartsModule } from 'ngx-echarts';

@NgModule({
  declarations: [
    SubscriberComponent,
    TagComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    SubscribersRoutingModule,
    SharedModule,
    SubscribersStoreModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    })
  ]
})
export class SubscribersModule {}
