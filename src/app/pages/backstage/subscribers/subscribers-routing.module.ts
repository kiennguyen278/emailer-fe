import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SubscriberComponent} from "./pages/subscriber/subscriber.component";
import {TagComponent} from "./pages/tag/tag.component";

const routes: Routes = [
  { path: '', redirectTo: 'subscriber', pathMatch: 'full' },
  { path: 'subscriber', component: SubscriberComponent, data: { title: 'Subscribers', reuse: true } },
  { path: 'tag', component: TagComponent, data: { title: 'Tags', reuse: true } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubscribersRoutingModule {}
