import {createAction, props} from "@ngrx/store";


export const findAccountManager = createAction(
  '[Account] Find Account Manager',
  props<{ payload: any }>()
);
