import {createFeatureSelector, createSelector} from "@ngrx/store";
import {sidebarFeatureKey, SidebarState} from "./reducer";

export const selectSidebarState =
  createFeatureSelector<SidebarState>(sidebarFeatureKey);

export const selectChangeCollapsed = createSelector(
  selectSidebarState,
  (state) => state.collapsed
);
