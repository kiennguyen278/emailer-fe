import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {BackstageDefaultComponent} from './backstage-default.component';
import {SidebarComponent} from './sidebar/sidebar.component'
import {ReuseTabComponent} from './reuse-tab/reuse-tab.component'
import {HeaderComponent} from './header/header.component'
import {FooterComponent} from './footer/footer.component'
import {ZorroAntdModule} from "@shared/zorro-antd.module";
import {SharedModule} from "@shared/shared.module";

@NgModule({
  declarations: [
    BackstageDefaultComponent,
    SidebarComponent,
    ReuseTabComponent,
    HeaderComponent,
    FooterComponent
  ],
  exports: [
    BackstageDefaultComponent,
    SidebarComponent,
    ReuseTabComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    ZorroAntdModule,
    SharedModule,
    RouterModule
  ]
})
export class BackstageDefaultModule {
}
