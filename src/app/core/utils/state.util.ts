import { CrudState, ResultState } from '@core/models';
import { createAction, FunctionWithParametersType } from '@ngrx/store';
import { TypedAction } from '@ngrx/store/src/models';

export class StateUtil {
  static initiateResultState(): ResultState {
    return {
      loading: false,
      success: null,
      error: null as any,
      loaded: false,
      result: null
    };
  }

  static initiateCrudState(initialState?: any): CrudState {
    return {
      ...StateUtil.initiateResultState(),
      items: [],
      options: [],
      total: 0,
      selectedItem: null,
      selectedKeys: [],
      ...initialState
    };
  }
}

export function createHTTPActions<
  RequestPayload,
  ResponsePayload,
  ErrorPayload
>(
  actionType: string
): [
  FunctionWithParametersType<
    [any],
    { payload: RequestPayload } & TypedAction<string>
  > &
    TypedAction<string>,
  FunctionWithParametersType<
    [any],
    { payload: ResponsePayload } & TypedAction<string>
  > &
    TypedAction<string>,
  FunctionWithParametersType<
    [any],
    { error?: ErrorPayload } & TypedAction<string>
  > &
    TypedAction<string>
] {
  return [
    createAction(actionType, (payload: RequestPayload) => {
      return payload as any;
    }),
    createAction(`${actionType} Success`, (payload: ResponsePayload) => ({
      payload
    })),
    createAction(`${actionType} Error`, (error?: ErrorPayload) => ({
      error
    }))
  ];
}
