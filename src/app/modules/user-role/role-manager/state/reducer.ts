import {createReducer, on} from "@ngrx/store";
import * as RoleManagerActions from "./actions";
import { ItemRole } from '../models';
import { ItemUser } from '@modules/user-role/user-manager/models';

export const roleManagerFeatureKey = 'roleManager';

export interface RoleManagerState {
  roleList: {data: ItemRole[], totalItem: number, loading: boolean, error: any}
  saveRoleItem: {loading: boolean, error: any, success: boolean}
  listUserInRole: {data: any[], totalItem: number, loading: boolean, error: any}
  listUserAddToRole: {data: ItemUser[], loading: boolean, error: any}
  roleToGetUser: {data: ItemRole}
}

const initialState: RoleManagerState = {
  roleList: {data: [], totalItem: 0, loading: false, error: null},
  saveRoleItem: {loading: false, error: null, success: false},
  listUserInRole: {data: [], totalItem: 0, loading: false, error: null},
  listUserAddToRole: {data: [], loading: false, error: null},
  roleToGetUser: {data: {} as ItemRole},
};

export const RoleManagerReducer = createReducer(
  initialState,

  // get list table role
  on(RoleManagerActions.loadListRole, (state) => ({
    ...state,
    roleList: {...state.roleList, loading: true},
  })),
  on(RoleManagerActions.loadListRoleSuccess, (state, res) => ({
    ...state,
    roleList: {
      ...state.roleList,
      loading: false,
      data: res.payload.content,
      totalItem: res.payload.totalElements
    },
  })),
  on(RoleManagerActions.loadListRoleFail, (state, {error}) => ({
    ...state,
    roleList: {...initialState.roleList, loading: false, error: error},
  })),
  on(RoleManagerActions.clearStateListRole, (state) => ({
    ...state,
    roleList: initialState.roleList,
  })),
  // get list table role


  // get list table role
  on(RoleManagerActions.saveRoleItem, (state) => ({
    ...state,
    saveRoleItem: {...initialState.saveRoleItem, loading: true},
  })),
  on(RoleManagerActions.saveRoleItemSuccess, (state, res) => ({
    ...state,
    saveRoleItem: { ...initialState.saveRoleItem, success: true},
  })),
  on(RoleManagerActions.saveRoleItemFail, (state, {error}) => ({
    ...state,
    saveRoleItem: {...initialState.saveRoleItem, error: error.error},
  })),
  on(RoleManagerActions.clearStateSaveRoleItem, (state) => ({
    ...state,
    saveRoleItem: initialState.saveRoleItem,
  })),
  // get list table role


  // get list user in role
  on(RoleManagerActions.setSelectRoleToGetUser, (state, {payload}) => ({
    ...state,
    roleToGetUser: {data: payload},
  })),
  on(RoleManagerActions.getListUserInRole, (state) => ({
    ...state,
    listUserInRole: {...state.listUserInRole, loading: true},
  })),
  on(RoleManagerActions.getListUserInRoleSuccess, (state, res) => ({
    ...state,
    listUserInRole: {
      ...state.listUserInRole,
      loading: false,
      data: res.payload.content,
      totalItem: res.payload.totalElements
    },
  })),
  on(RoleManagerActions.getListUserInRoleFail, (state, {error}) => ({
    ...state,
    listUserInRole: {...initialState.listUserInRole, loading: false, error: error},
  })),
  on(RoleManagerActions.clearStateListUserInRole, (state) => ({
    ...state,
    listUserInRole: initialState.listUserInRole,
  })),

  on(RoleManagerActions.clearStateScreenRoleManager, (state) => ({
    ...state,
    listUserInRole: initialState.listUserInRole,
    roleToGetUser: initialState.roleToGetUser,
  })),
  // get list user in role


  // get list user add to role
  on(RoleManagerActions.getListUserAddToRole, (state) => ({
    ...state,
    listUserAddToRole: {...state.listUserAddToRole, loading: true},
  })),
  on(RoleManagerActions.getListUserAddToRoleSuccess, (state, res) => ({
    ...state,
    listUserAddToRole: {
      ...state.listUserAddToRole,
      loading: false,
      data: res.payload,
    },
  })),
  on(RoleManagerActions.getListUserAddToRoleFail, (state, {error}) => ({
    ...state,
    listUserAddToRole: {...initialState.listUserAddToRole, loading: false, error: error},
  })),
  on(RoleManagerActions.clearStateListUserAddToRole, (state) => ({
    ...state,
    listUserAddToRole: initialState.listUserAddToRole,
  })),
  // get list user add to role


)
