import {createAction, props} from "@ngrx/store";
import { createHTTPActions } from '@core/utils/state.util';


export const [
  getListEmailTemplate,
  getListEmailTemplateSuccess,
  getListEmailTemplateFail
] = createHTTPActions<void, any, { error: any}>('[Email Template List] Get List', false);
export const clearStateListEmailTemplate = createAction('[Email Template List] Clear State List');




export const [
  getListEmailCampaign,
  getListEmailCampaignSuccess,
  getListEmailCampaignFail
] = createHTTPActions<void, any, { error: any}>('[Email Campaign List] Get List', false);
export const clearStateListEmailCampaign = createAction('[Email Campaign List] Clear State List');




export const [
  getListSequence,
  getListSequenceSuccess,
  getListSequenceFail
] = createHTTPActions<void, any, { error: any}>('[Email Sequence List] Get List', false);
export const clearStateListSequence = createAction('[Email Sequence List] Clear State List');
