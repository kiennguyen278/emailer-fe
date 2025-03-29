import {createReducer, on} from "@ngrx/store";
import * as Actions from "./actions";
import { ItemUser } from '@modules/user-role/user-manager/models';

export const subscribersFeatureKey = 'subscribersManager';

export interface SubscribersManagerState {
  userList: {data: ItemUser[], totalItem: number, loading: boolean, error: any}
}

const initialState: SubscribersManagerState = {
  userList: {data: [], totalItem: 0, loading: false, error: null}
};

export const SubscribersReducer = createReducer(
  initialState,

  on(Actions.getListUser, (state) => ({
    ...state,
    userList: {...state.userList, loading: true},
  })),
  on(Actions.getListUserSuccess, (state, res) => ({
    ...state,
    userList: {
      ...state.userList,
      loading: false,
      data: res.payload.content,
      totalItem: res.payload.totalElements,

    }, // res.payload là khi action dùng createHTTPActions thay vì dùng createAction
  })),
  on(Actions.getListUserFail, (state, {error}) => ({
    ...state,
    userList: {...initialState.userList, loading: false, error: error},
  })),
  on(Actions.clearStateListUser, (state) => ({
    ...state,
    userList: initialState.userList,
  })),
)
