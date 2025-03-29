import { createFeatureSelector, createSelector } from '@ngrx/store';
import { subscribersFeatureKey, SubscribersManagerState } from './reducer';

export const selectSubscribersState =
  createFeatureSelector<SubscribersManagerState>(subscribersFeatureKey);


export const selectDataListUser = createSelector(
  selectSubscribersState,
  (state) => {


    // return content;
    return state.userList.data
  }
);

export const selectLoadingListUser = createSelector(
  selectSubscribersState,
  (state) => state.userList.loading
);

export const selectTotalListUser = createSelector(
  selectSubscribersState,
  (state) => state.userList.totalItem
);
