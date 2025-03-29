import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ZorroAntdModule } from '@shared/zorro-antd.module';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '@shared/components/components.module';
import { ControlsModule } from '@shared/controls/controls.module';
import { PipesModule } from '@shared/pipes/pipes.module';
import { DirectivesModule } from '@shared/directives/directives.module';
import { LightboxModule } from 'ngx-lightbox';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ZorroAntdModule,
    ComponentsModule,
    PipesModule,
    DirectivesModule,
    ControlsModule,
    TranslateModule,
    DragDropModule,
    LightboxModule,
  ],
  imports: [
    
  ],
  providers: [
  ]

})
export class SharedModule {}
