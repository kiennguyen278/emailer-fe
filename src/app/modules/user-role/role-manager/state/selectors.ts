import { createFeatureSelector, createSelector } from '@ngrx/store';
import { roleManagerFeatureKey, RoleManagerState } from './reducer';

export const selectRoleState =
  createFeatureSelector<RoleManagerState>(roleManagerFeatureKey);


// state get list role table
export const selectDataListRole = createSelector(
  selectRoleState, (state) => state.roleList.data
);
export const selectLoadingListRole = createSelector(
  selectRoleState, (state) => state.roleList.loading
);
export const selectTotalListRole = createSelector(
  selectRoleState, (state) => state.roleList.totalItem
);



// state save role item
export const selectLoadingSaveRoleItem = createSelector(
  selectRoleState, (state) => state.saveRoleItem.loading
);
export const selectSuccessSaveRoleItem = createSelector(
  selectRoleState, (state) => state.saveRoleItem.success
);
export const selectErrorSaveRoleItem = createSelector(
  selectRoleState, (state) => state.saveRoleItem.error
);



// get list user in role
export const selectRoleToGetUser = createSelector(
  selectRoleState, (state) => state.roleToGetUser.data
);
export const selectDataListUserInRole = createSelector(
  selectRoleState, (state) => state.listUserInRole.data
);
export const selectLoadingListUserInRole = createSelector(
  selectRoleState, (state) => state.listUserInRole.loading
);
export const selectTotalListUserRole = createSelector(
  selectRoleState, (state) => state.listUserInRole.totalItem
);



// state get list user add to role
export const selectDataListUserAddToRole = createSelector(
  selectRoleState, (state) => state.listUserAddToRole.data
);
export const selectLoadingListUserAddToRole = createSelector(
  selectRoleState, (state) => state.listUserAddToRole.loading
);
export const selectTotalListUserAddToRole = createSelector(
  selectRoleState, (state) => 0
);







