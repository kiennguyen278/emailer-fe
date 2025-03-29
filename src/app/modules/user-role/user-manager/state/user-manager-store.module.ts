import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { UserManagerEffects } from './effects';
import { userManagerFeatureKey, UserManagerReducer } from './reducer';
import { UserManagerServices } from './service';


@NgModule({
  imports: [
    StoreModule.forFeature(userManagerFeatureKey, UserManagerReducer),
    EffectsModule.forFeature([UserManagerEffects])
  ],
  providers: [
    UserManagerServices,
  ]
})
export class UserManagerStoreModule { }
