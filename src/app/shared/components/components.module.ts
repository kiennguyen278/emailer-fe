import { NgModule, ModuleWithProviders } from '@angular/core';
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ZorroAntdModule} from "../zorro-antd.module";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {NzOutletModule} from "ng-zorro-antd/core/outlet";
import {G2CardComponent} from "./g2-card/g2-card.component";
import {G2MiniAreaComponent} from "./g2-mini-area/g2-mini-area.component";
import {G2MiniBarComponent} from "./g2-mini-bar/g2-mini-bar.component";
import {G2MiniProgressComponent} from "./g2-mini-progress/g2-mini-progress.component";
import {TrendComponent} from "./trend/trend.component";
import {NotificationComponent} from "@shared/components/notification/notification.component";
import {FormControlComponent} from "@shared/components/form-control/form-control.component";
import {ConfirmationComponent} from "@shared/components/confirmation/confirmation.component";
import {PaginationComponent} from "@shared/components/pagination/pagination.component";
import {TableComponent} from "@shared/components/table/table.component";
import {DirectivesModule} from "@shared/directives/directives.module";
import {PipesModule} from "@shared/pipes/pipes.module";
import {TranslateModule} from "@ngx-translate/core";

const COMPONENTS_CORE = [
  G2CardComponent,
  G2MiniAreaComponent,
  G2MiniBarComponent,
  G2MiniProgressComponent,
  TrendComponent,
  NotificationComponent,
  FormControlComponent,
  ConfirmationComponent,
  PaginationComponent,
  TableComponent,
];

@NgModule({
  declarations: COMPONENTS_CORE,
  exports: COMPONENTS_CORE,
  imports: [
    CommonModule,
    // ControlsModule,
    // PipesModule,
    RouterModule,
    FormsModule,
    NzOutletModule,
    ZorroAntdModule,
    ReactiveFormsModule,
    DragDropModule,
    DirectivesModule,
    PipesModule,
    TranslateModule
  ],
})
export class ComponentsModule {
  // static forRoot(): ModuleWithProviders<ComponentsModule> {
  //   return {
  //     ngModule: ComponentsModule,
  //     providers: [],
  //   };
  // }
}
