import { createFeatureSelector, createSelector } from '@ngrx/store';
import {emailFeatureKey, EmailState} from './reducer';

export const selectEmailState =
  createFeatureSelector<EmailState>(emailFeatureKey);


export const selectDataGetEmailTemplateList = createSelector(
  selectEmailState,
  (state) => state.emailTemplateList.data || []
);
export const selectLoadingGetEmailTemplateList = createSelector(
  selectEmailState,
  (state) => state.emailTemplateList.loading
);
export const selectErrorGetEmailTemplateList = createSelector(
  selectEmailState,
  (state) => state.emailTemplateList.error
);


