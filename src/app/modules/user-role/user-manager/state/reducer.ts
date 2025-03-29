import {createReducer, on} from "@ngrx/store";
import * as UserManagerActions from "./actions";
import { ItemUser } from '@modules/user-role/user-manager/models';

export const userManagerFeatureKey = 'userManager';

export interface UserManagerState {
  userList: {data: ItemUser[], totalItem: number, loading: boolean, error: any}
}

const initialState: UserManagerState = {
  userList: {data: [], totalItem: 0, loading: false, error: null}
};

export const UserManagerReducer = createReducer(
  initialState,

  on(UserManagerActions.getListUser, (state) => ({
    ...state,
    userList: {...state.userList, loading: true},
  })),
  on(UserManagerActions.getListUserSuccess, (state, res) => ({
    ...state,
    userList: {
      ...state.userList,
      loading: false,
      data: res.payload.content,
      totalItem: res.payload.totalElements,

    }, // res.payload là khi action dùng createHTTPActions thay vì dùng createAction
  })),
  on(UserManagerActions.getListUserFail, (state, {error}) => ({
    ...state,
    userList: {...initialState.userList, loading: false, error: error},
  })),
  on(UserManagerActions.clearStateListUser, (state) => ({
    ...state,
    userList: initialState.userList,
  })),
)
