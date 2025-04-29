import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { SettingsRoutingModule } from './settings-routing.module';
import { MainComponent } from './main/main.component';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { IntegrationsComponent } from './integrations/integrations.component';
import { SettingsService } from './data/settings.service'; // ✅ import service
import { NzModalModule } from 'ng-zorro-antd/modal'; // ✅ thêm dòng này
import { NzTableModule } from 'ng-zorro-antd/table'; // ✅ thêm dòng này

@NgModule({
  declarations: [MainComponent,
    IntegrationsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzTabsModule,
    NzCardModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSwitchModule,
    NzSelectModule,
    NzTagModule,
    NzModalModule,
    NzTableModule,
    SettingsRoutingModule
  ],
  providers: [
    SettingsService // ✅ thêm provider tại đây
  ]
})
export class SettingsModule {}
