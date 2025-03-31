import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import {EmailEffects} from './effects';
import { emailFeatureKey, EmailReducer } from './reducer';
import {EmailService} from "./service";


@NgModule({
  imports: [
    StoreModule.forFeature(emailFeatureKey, EmailReducer),
    EffectsModule.forFeature([EmailEffects])
  ],
  providers: [
    EmailService,
  ]
})
export class EmailStoreModule { }
