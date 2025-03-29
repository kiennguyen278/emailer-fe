import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { RoleManagerEffects } from './effects';
import { roleManagerFeatureKey, RoleManagerReducer } from './reducer';
import { RoleManagerServices } from './service';


@NgModule({
  imports: [
    StoreModule.forFeature(roleManagerFeatureKey, RoleManagerReducer),
    EffectsModule.forFeature([RoleManagerEffects])
  ],
  providers: [
    RoleManagerServices,
  ]
})
export class RoleManagerStoreModule { }
