import {createAction, props} from "@ngrx/store";

export const changeCollapsed = createAction(
  '[Sidebar] Change Collapsed',
  props<{ collapsed: boolean }>()
);

