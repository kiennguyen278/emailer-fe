import { createFeatureSelector, createSelector } from '@ngrx/store';
import { subscribersFeatureKey, SubscribersManagerState } from './reducer';
import { OptionModel } from '@core/models';
import { TagDTO } from '@modules/subscribers/models';

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


export const selectOptionsTagsList = createSelector(
  selectSubscribersState,
  (state) => {
    const options: OptionModel<number>[] = state.tagsList.data.map((item: TagDTO) => {
      return {
        label: item.name,
        value: item.id,
      }
    }) || [];
    return options
  }
);



export const selectDataGetSubscriberList = createSelector(
  selectSubscribersState,
  (state) => state.subscriberList.data || []
);
export const selectLoadingGetSubscriberList = createSelector(
  selectSubscribersState,
  (state) => state.subscriberList.loading
);
export const selectTotalItemsGetSubscriberList = createSelector(
  selectSubscribersState,
  (state) => state.subscriberList.totalItems
);
