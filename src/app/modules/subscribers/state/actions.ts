import {createAction, props} from "@ngrx/store";
import { createHTTPActions } from '@core/utils/state.util';
import { GetListUserRequest, GetListUserResponsed } from '@modules/user-role/user-manager/models';


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
] = createHTTPActions<void, any, { error: any}>('[Tags List] Get List Tags', false);
export const clearStateListTags = createAction('[Tags List] Clear State List Tags');
