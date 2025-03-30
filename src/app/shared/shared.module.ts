import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {ComponentsModule} from "./components/components.module";
import {ZorroAntdModule} from "./zorro-antd.module";
import {PipesModule} from "./pipes/pipes.module";
import {DirectivesModule} from "./directives/directives.module";
import {ControlsModule} from "./controls/controls.module";

@NgModule({
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ZorroAntdModule,
    ComponentsModule,
    DirectivesModule,
    PipesModule,
    ControlsModule,
    DragDropModule,
  ],
  imports: [
  ],
  providers: [
  ]

})
export class SharedModule {}
