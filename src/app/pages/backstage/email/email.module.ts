import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {QuillModule} from 'ngx-quill';
import { ReactiveFormsModule } from '@angular/forms';

import { EmailRoutingModule } from './email-routing.module';
import { TemplatesComponent } from './pages/templates/templates.component';
import {TemplateFormComponent} from "./pages/templates/template-form/template-form.component";
import {CampaignsComponent} from "./pages/campaigns/campaigns.component";
import {SequencesComponent} from "./pages/sequences/sequences.component";
import {SharedModule} from "@shared/shared.module";
import {EmailStoreModule} from "./state/email-store.module";
import {CampaignFormComponent} from "./pages/campaigns/campaign-form/campaign-form.component";
import {SubscribersStoreModule} from "../subscribers/state/subscribers-store.module";
import {CampaignDetailComponent} from "./pages/campaigns/campaign-detail/campaign-detail.component";
import {SequenceFormComponent} from "./pages/sequences/sequence-form/sequence-form.component";
import {DragDropModule} from "@angular/cdk/drag-drop";

const components = [
  TemplatesComponent,
  TemplateFormComponent,

  CampaignsComponent,
  CampaignFormComponent,
  CampaignDetailComponent,

  SequencesComponent,
  SequenceFormComponent,
];

@NgModule({
  declarations: components,
  imports: [
    CommonModule,
    QuillModule,
    ReactiveFormsModule,
    EmailRoutingModule,
    EmailStoreModule,
    SubscribersStoreModule,
    SharedModule,
    DragDropModule,
  ]
})
export class EmailModule { }
