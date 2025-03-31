import {createReducer, on} from "@ngrx/store";
import * as Actions from "./actions";
import { EmailTemplateDTO } from '../models';

export const emailFeatureKey = 'emailTemplate';

export interface EmailState {
  emailTemplateList: {data: EmailTemplateDTO[], loading: boolean, error: any}
}

const initialState: EmailState = {
  emailTemplateList: {data: [], loading: false, error: null},
};

export const EmailReducer = createReducer(
  initialState,

  on(Actions.getListEmailTemplate, (state) => ({
    ...state,
    emailTemplateList: { ...initialState.emailTemplateList, loading: true }
  })),
  on(Actions.getListEmailTemplateSuccess, (state, res) => {
    return {
      ...state,
      emailTemplateList: { ...initialState.emailTemplateList, data: res.payload}
    }
  }),
  on(Actions.getListEmailTemplateFail, (state, { error }) => ({
    ...state,
    emailTemplateList: { ...initialState.emailTemplateList, error: error}
  })),




)
