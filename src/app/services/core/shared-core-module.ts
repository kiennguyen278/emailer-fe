import { NgModule, Optional, SkipSelf, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionStorageService } from './session-storage.service';
import { LocalStorageService } from './local-storage.service';

const GUARD_SERVICE_PROVIDES = [
  SessionStorageService,
  LocalStorageService,
];

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
  ]
})
export class SharedCoreModule {
    static forRoot(): ModuleWithProviders<SharedCoreModule> {
    return {
      ngModule: SharedCoreModule,
      providers: [...GUARD_SERVICE_PROVIDES],
    };
  }
}
