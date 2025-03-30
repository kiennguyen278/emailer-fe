import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { UserManagerEffects } from './effects';
import { subscribersFeatureKey, SubscribersReducer } from './reducer';
import { SubscribersService } from './service';


@NgModule({
  imports: [
    StoreModule.forFeature(subscribersFeatureKey, SubscribersReducer),
    EffectsModule.forFeature([UserManagerEffects])
  ],
  providers: [
    SubscribersService,
  ]
})
export class SubscribersStoreModule { }
