import { ActionReducer, INIT, MetaReducer } from "@ngrx/store";
import {cloneDeep} from "lodash";
import {globalbarFeatureKey} from "./reducer";

export function hydrationMetaReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return function(state, action) {
    // console.log(action.type, action);
    const nextState = reducer(state, action);
    const stateKey = globalbarFeatureKey;

    if ( action.type === INIT) {
      const storageValue = localStorage.getItem(stateKey);
      if (storageValue) {
        try {
          const savedState: any = JSON.parse(storageValue);
          savedState.lastUpdateField = 'init';
          nextState[stateKey] = savedState;

        } catch(e) {
          console.error(e);
          localStorage.removeItem(stateKey);
        }
      }
    }

    try {
      let data = cloneDeep(nextState[stateKey]);
      localStorage.setItem(stateKey, JSON.stringify(data));
    } catch (error) {
      console.error('localStorage', nextState[stateKey]);

    }
    return nextState;
  };
}

export const metaReducers: MetaReducer<any>[] = [hydrationMetaReducer];
