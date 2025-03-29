import { createFeatureSelector, createSelector } from '@ngrx/store';
import { subscribersFeatureKey, SubscribersManagerState } from './reducer';

export const selectSubscribersState =
  createFeatureSelector<SubscribersManagerState>(subscribersFeatureKey);


export const selectDataGetTagsList = createSelector(
  selectSubscribersState,
  (state) => state.tagsList.data || []
);

export const selectLoadingGetTagsList = createSelector(
  selectSubscribersState,
  (state) => state.tagsList.loading
);

export const selectErrorGetTagsList = createSelector(
  selectSubscribersState,
  (state) => state.tagsList.error
);
