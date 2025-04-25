import {createFeatureSelector, createSelector, createSelectorFactory, defaultMemoize} from "@ngrx/store";
import {globalbarFeatureKey, SidebarState} from "./reducer";
import {isEqual} from "lodash";

export const selectSidebarState =
  createFeatureSelector<SidebarState>(globalbarFeatureKey);

export const selectChangeCollapsed = createSelector(
  selectSidebarState,
  (state) => state.collapsed
);


// cách dùng để select data từ store chỉ khi value của object thay đổi, ko subscribe khi object thay đổi referance
const deepSelector = createSelectorFactory((projector) =>
  defaultMemoize(projector, isEqual)
)(selectSidebarState, (state) => state.collapsed);
