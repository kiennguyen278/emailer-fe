import { createAction } from '@ngrx/store';

export function createHTTPActions<
  RequestPayload = void,
  ResponsePayload = void,
  ErrorPayload = any
>(
  actionType: string,
  hasRequestPayload: boolean = true,
  // hasResponsePayload: boolean = true,
  // hasErrorPayload: boolean = true,
)
//   : [
//   FunctionWithParametersType<[any], { payload: RequestPayload } & TypedAction<string>> & TypedAction<string>,
//   FunctionWithParametersType<[any], { payload: ResponsePayload } & TypedAction<string>> & TypedAction<string>,
//   FunctionWithParametersType<[any], { error?: ErrorPayload } & TypedAction<string>> & TypedAction<string>
// ]
{

  const requestAction = hasRequestPayload
    ? createAction(actionType, (payload: RequestPayload) => {return payload as any;})
    : createAction(actionType);

  // const successAction = hasResponsePayload
  //   ? createAction(`${actionType} Success`, (payload: ResponsePayload) => ({payload}))
  //   : createAction(`${actionType} Success`);

  const successAction = createAction(`${actionType} Success`, (payload: ResponsePayload) => ({payload}));

  // const errorAction = hasErrorPayload
  //   ? createAction(`${actionType} Error`, (error?: ErrorPayload) => ({error}))
  //   : createAction(`${actionType} Error`);

  const errorAction = createAction(`${actionType} Error`, (error?: ErrorPayload) => ({error}))

  return [ requestAction, successAction, errorAction ];
}
