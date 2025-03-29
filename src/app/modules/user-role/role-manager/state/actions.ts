import {createAction, props} from "@ngrx/store";
import { createHTTPActions } from '@core/utils/state.util';
import {
  GetListRoleRequest,
  GetListRoleResponsed, GetListUserAddToRoleRequest,
  GetListUserInRoleRequest, ItemRole,
  SaveRoleItemRequest
} from '@modules/user-role/role-manager/models';


export const [
  loadListRole,
  loadListRoleSuccess,
  loadListRoleFail
] = createHTTPActions<GetListRoleRequest, GetListRoleResponsed, any>(
  '[RoleManager] Get List Role'
);
export const clearStateListRole = createAction('[RoleManager] Clear State List Role');



export const [
  saveRoleItem,
  saveRoleItemSuccess,
  saveRoleItemFail
] = createHTTPActions<SaveRoleItemRequest, any, any>(
  '[RoleManager] Save Role Item'
);
export const clearStateSaveRoleItem = createAction('[RoleManager] Clear State Save Role Item');



export const setSelectRoleToGetUser = createAction(
  '[RoleManager] Set Select Role To Get User',
  props<{ payload: ItemRole }>()
  );
export const [
  getListUserInRole,
  getListUserInRoleSuccess,
  getListUserInRoleFail
] = createHTTPActions<GetListUserInRoleRequest, any, any>(
  '[RoleManager] Get List User In Role'
);
export const clearStateListUserInRole = createAction('[RoleManager] Clear State List User In Role');
export const clearStateScreenRoleManager = createAction('[RoleManager] Clear State Screen Role Manager');





export const [
  getListUserAddToRole,
  getListUserAddToRoleSuccess,
  getListUserAddToRoleFail
] = createHTTPActions<GetListUserAddToRoleRequest, any, any>(
  '[RoleManager] Get List User Add To Role'
);
export const clearStateListUserAddToRole = createAction('[RoleManager] Clear State List User Add To Role');







