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




export const selectDataGetEmailCampaignList = createSelector(
  selectEmailState,
  (state) => state.emailCampaignList.data || []
);
export const selectLoadingGetEmailCampaignList = createSelector(
  selectEmailState,
  (state) => state.emailCampaignList.loading
);
export const selectErrorGetEmailCampaignList = createSelector(
  selectEmailState,
  (state) => state.emailCampaignList.error
);



export const selectDataGetSequenceList = createSelector(
  selectEmailState,
  (state) => state.sequenceList.data || []
);
export const selectLoadingGetSequenceList = createSelector(
  selectEmailState,
  (state) => state.sequenceList.loading
);
export const selectErrorGetSequenceList = createSelector(
  selectEmailState,
  (state) => state.sequenceList.error
);
