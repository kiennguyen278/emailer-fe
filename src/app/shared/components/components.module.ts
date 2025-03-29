import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NotificationComponent } from '@shared/components/notification/notification.component';
import { FormControlComponent } from '@shared/components/form-control/form-control.component';
import { ZorroAntdModule } from '@shared/zorro-antd.module';
import { BasePrintTemplateComponent } from '@shared/components/base-print-template/base-print-template.component';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { ModalConfirmNavigateComponent } from '@shared/components/modal-confirm-navigate/modal-confirm-navigate.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { TableComponent } from '@shared/components/table/table.component';
import { ControlsModule } from '@shared/controls/controls.module';
import { PipesModule } from '@shared/pipes/pipes.module';
import { CheckboxViewComponent } from '@shared/components/checkbox-view/checkbox-view.component';
import { TitleBoxComponent } from '@shared/components/title-box/title-box.component';
import { ConfirmationComponent } from '@shared/components/confirmation/confirmation.component';
import { NzOutletModule } from 'ng-zorro-antd/core/outlet';
import { DragDropModule } from '@angular/cdk/drag-drop';


const components = [
  NotificationComponent,
  FormControlComponent,
  BasePrintTemplateComponent,
  BreadcrumbComponent,
  ModalConfirmNavigateComponent,
  PaginationComponent,
  TableComponent,
  CheckboxViewComponent,
  TitleBoxComponent,
  ConfirmationComponent,
];

@NgModule({
  declarations: components,
  imports: [
    CommonModule,
    ControlsModule,
    PipesModule,
    RouterModule,
    FormsModule,
    NzOutletModule,
    ZorroAntdModule,
    ReactiveFormsModule,
    TranslateModule,
    DragDropModule
  ],
  exports: components
})
export class ComponentsModule {}
