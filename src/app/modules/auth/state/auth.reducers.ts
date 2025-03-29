import {createReducer, on} from "@ngrx/store";
import * as AccountManagerActions from "@modules/auth/state/auth.actions";

export const accountManagerFeatureKey = 'accountManager';

export interface AccountManagerState {
  data: any;

}

const initialState: AccountManagerState = {
  data: [],
};

export const AccountManagerReducer = createReducer(
  initialState,
  on(AccountManagerActions.findAccountManager, (state, _) => ({
    ...state,
    loading: true
  })),

)
