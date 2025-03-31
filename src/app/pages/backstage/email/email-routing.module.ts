import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TemplatesComponent } from './pages/templates/templates.component';
import {TemplateFormComponent} from "./pages/templates/template-form/template-form.component";
import {CampaignsComponent} from "./pages/campaigns/campaigns.component";
import {SequencesComponent} from "./pages/sequences/sequences.component";

const routes: Routes = [
  {
    path: 'templates',
    component: TemplatesComponent,
    data: { title: 'Templates', reuse: true }
  },
  // {
  //   path: 'templates/create',
  //   component: TemplateFormComponent,
  // },
  {
    path: 'templates/edit/:id',
    component: TemplateFormComponent,
  },

  { path: 'campaigns', component: CampaignsComponent, data: { title: 'Campaigns', reuse: true } },
  { path: 'sequences', component: SequencesComponent, data: { title: 'Sequences', reuse: true } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmailRoutingModule {}
