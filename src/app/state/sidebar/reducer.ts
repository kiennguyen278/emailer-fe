import {createReducer, on} from "@ngrx/store";
import * as SidebarActions from "./actions";

export const sidebarFeatureKey = 'sidebar';

export interface SidebarState {
  collapsed: any;
}

const initialState: SidebarState = {
  collapsed: false,
};

export const SidebarReducer = createReducer(
  initialState,
  on(SidebarActions.changeCollapsed, (state, {collapsed}) => ({
    ...state,
    collapsed: collapsed
  })),
)
