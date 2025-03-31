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


@NgModule({
  declarations: [
    TemplatesComponent,
    CampaignsComponent,
    SequencesComponent,
    TemplateFormComponent
  ],
  imports: [
    CommonModule,
    QuillModule,
    ReactiveFormsModule,
    EmailRoutingModule,
    EmailStoreModule,
    SharedModule
  ]
})
export class EmailModule { }
