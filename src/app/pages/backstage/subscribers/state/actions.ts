import {createAction, props} from "@ngrx/store";
import { createHTTPActions } from '@core/utils/state.util';
import { SubscriberSearchDTO } from '../models';


// export const [
//   getListUser,
//   getListUserSuccess,
//   getListUserFail
// ] = createHTTPActions<GetListUserRequest, GetListUserResponsed, any>(
//   '[UserManager] Get List User'
// );
// export const clearStateListUser = createAction('[UserManager] Clear State List User');



export const [
  getListTags,
  getListTagsSuccess,
  getListTagsFail
] = createHTTPActions<void, any, { error: any}>('[Subscribers List] Get List Tags', false);
export const clearStateListTags = createAction('[Tags List] Clear State List Tags');



export const [
  getListSubscribers,
  getListSubscribersSuccess,
  getListSubscribersFail
] = createHTTPActions<{payload: SubscriberSearchDTO}, any, { error: any}>('[Subscribers List] Get List Subscribers');
export const clearStateListSubscribers = createAction('[Subscribers List] Clear State List Subscribers');
