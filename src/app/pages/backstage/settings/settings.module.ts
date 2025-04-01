import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SettingsRoutingModule } from './settings-routing.module';
import { MainComponent } from './main/main.component';

// Ng Zorro Modules bạn đang dùng
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzModalModule } from 'ng-zorro-antd/modal';

@NgModule({
  declarations: [MainComponent],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    FormsModule,
    ReactiveFormsModule,

    // Ng Zorro modules
    NzCardModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzTagModule,
    NzMessageModule,
    NzSwitchModule,
    NzTabsModule,
    NzGridModule,
    NzModalModule
  ]
})
export class SettingsModule { }
