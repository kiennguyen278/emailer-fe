import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MainComponent} from "./main/main.component";
import {WorkflowBuilderComponent} from "./workflow-builder/workflow-builder.component";

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    data: { title: 'workflows', reuse: false }
  },
  {
    path: 'builder',
    component: WorkflowBuilderComponent,
    data: { title: 'Workflow Builder' }
  },
  {
    path: 'builder/:id',
    component: WorkflowBuilderComponent,
    data: { title: 'Edit Workflow' }
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkflowsRoutingModule { }
