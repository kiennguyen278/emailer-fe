import {createAction, props} from "@ngrx/store";
import { createHTTPActions } from '@core/utils/state.util';


export const [
  getListEmailTemplate,
  getListEmailTemplateSuccess,
  getListEmailTemplateFail
] = createHTTPActions<void, any, { error: any}>('[Email Template List] Get List', false);
export const clearStateListEmailTemplate = createAction('[Email Template List] Clear State List');


