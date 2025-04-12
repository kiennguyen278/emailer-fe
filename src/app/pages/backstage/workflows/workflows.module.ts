import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import { FormsModule } from '@angular/forms'; // ✅ Thêm dòng này
import { WorkflowBuilderComponent } from './workflow-builder/workflow-builder.component';
import { RouterModule } from '@angular/router';
import { WorkflowService } from './data/workflow.service';
import { WorkflowsRoutingModule } from './workflows-routing.module';
import {ComponentsModule} from "@shared/components/components.module";
import {SharedModule} from "@shared/shared.module";

@NgModule({
  declarations: [
    MainComponent,
    WorkflowBuilderComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    WorkflowsRoutingModule,
    ComponentsModule,
    SharedModule
  ],
  providers: [
    WorkflowService
  ]
})
export class WorkflowsModule { }
