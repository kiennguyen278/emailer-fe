import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TagComponent } from '@modules/subscribers/pages/tag/tag.component';
import { SubscribersRoutingModule } from '@modules/subscribers/subscribers-routing.module';
import { SubscribersStoreModule } from '@modules/subscribers/state/subscribers-store.module';
import { SharedModule } from '@shared/shared.module';
import { SubscriberComponent } from '@modules/subscribers/pages/subscriber/subscriber.component';

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
  ]
})
export class SubscribersModule {}
