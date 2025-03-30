import {createFeatureSelector, createSelector} from "@ngrx/store";
import {globalbarFeatureKey, SidebarState} from "./reducer";

export const selectSidebarState =
  createFeatureSelector<SidebarState>(globalbarFeatureKey);

export const selectChangeCollapsed = createSelector(
  selectSidebarState,
  (state) => state.collapsed
);
