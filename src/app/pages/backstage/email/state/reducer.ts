import {createReducer, on} from "@ngrx/store";
import * as Actions from "./actions";
import {EmailCampaignDTO, EmailTemplateDTO} from '../models';

export const emailFeatureKey = 'emailTemplate';

export interface EmailState {
  emailTemplateList: {data: EmailTemplateDTO[], loading: boolean, error: any},
  emailCampaignList: {data: EmailCampaignDTO[], loading: boolean, error: any},
}

const initialState: EmailState = {
  emailTemplateList: {data: [], loading: false, error: null},
  emailCampaignList: {data: [], loading: false, error: null},
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


  on(Actions.getListEmailCampaign, (state) => ({
    ...state,
    emailCampaignList: { ...initialState.emailCampaignList, loading: true }
  })),
  on(Actions.getListEmailCampaignSuccess, (state, res) => {
    return {
      ...state,
      emailCampaignList: { ...initialState.emailCampaignList, data: res.payload}
    }
  }),
  on(Actions.getListEmailCampaignFail, (state, { error }) => ({
    ...state,
    emailCampaignList: { ...initialState.emailCampaignList, error: error}
  })),




)
