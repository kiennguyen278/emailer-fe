import {createReducer, on} from "@ngrx/store";
import * as Actions from "./actions";
import { TagDTO } from '@modules/subscribers/models';

export const subscribersFeatureKey = 'subscribersManager';

export interface SubscribersManagerState {
  tagsList: {data: TagDTO[], loading: boolean, error: any}
}

const initialState: SubscribersManagerState = {
  tagsList: {data: [], loading: false, error: null}
};

export const SubscribersReducer = createReducer(
  initialState,

  on(Actions.getListTags, (state) => ({
    ...state,
    tagsList: { ...initialState.tagsList, loading: true }
  })),
  on(Actions.getListTagsSuccess, (state, res) => {
    return {
      ...state,
      tagsList: { ...initialState.tagsList, data: res.payload}
    }
  }),
  on(Actions.getListTagsFail, (state, { error }) => ({
    ...state,
    tagsList: { ...initialState.tagsList, error: error}
  })),
)
