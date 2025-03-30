import {createReducer, on} from "@ngrx/store";
import * as Actions from "./actions";
import { SubscriberDTO, TagDTO } from '../models';

export const subscribersFeatureKey = 'subscribersManager';

export interface SubscribersManagerState {
  tagsList: {data: TagDTO[], loading: boolean, error: any}
  subscriberList: {data: SubscriberDTO[], loading: boolean, error: any, totalItems: number};
}

const initialState: SubscribersManagerState = {
  tagsList: {data: [], loading: false, error: null},
  subscriberList: {data: [], loading: false, error: null, totalItems: 0}
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



  on(Actions.getListSubscribers, (state) => ({
    ...state,
    subscriberList: { ...initialState.subscriberList, loading: true }
  })),
  on(Actions.getListSubscribersSuccess, (state, {payload}) => {
    console.log('payload', payload)
    return {
      ...state,
      subscriberList: { ...initialState.subscriberList, data: payload.content, totalItems: payload.totalElements }
    }
  }),
  on(Actions.getListSubscribersFail, (state, { error }) => ({
    ...state,
    subscriberList: { ...initialState.subscriberList, error: error}
  })),

)
