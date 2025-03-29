import {createFeatureSelector, createSelector} from "@ngrx/store";
import {accountManagerFeatureKey, AccountManagerState} from "@modules/auth/account/state/account-manager.reducers";

export const selectAccountManagerState =
  createFeatureSelector<AccountManagerState>(accountManagerFeatureKey);

export const selectAccountManager = createSelector(
  selectAccountManagerState,
  (state) => state.items
);

export const selectAccountManagerLoading = createSelector(
  selectAccountManagerState,
  (state) => state.loading
);

export const selectTotalAccountManager = createSelector(
  selectAccountManagerState,
  (state) => state.total
);

export const selectCreateAccount = createSelector(
  selectAccountManagerState,
  (state) => state.data
);

export const selectCreateAccountSuccess = createSelector(
  selectAccountManagerState,
  (state) => state.success
);

export const selectCreateAccountFail = createSelector(
  selectAccountManagerState,
  (state) => state.error
);


export const selectUploadImageUser = createSelector(
  selectAccountManagerState,
  (state) => state.image
);

export const selectUploadImageUserSuccess = createSelector(
  selectAccountManagerState,
  (state) => state.success
);

export const selectUploadImageUserFail = createSelector(
  selectAccountManagerState,
  (state) => state.error
);


export const selectFindRoomName = createSelector(
  selectAccountManagerState,
  (state) => state.infoRoom
);

export const selectAccountById = createSelector(
  selectAccountManagerState,
  (state) => state.userFound
);

export const selectInfomationRoles = createSelector(
  selectAccountManagerState,
  (state) => state.dataInfoRole
);

export const selectDegree = createSelector(
  selectAccountManagerState,
  (state) => state.dataDegree
);

export const selectUpdateAccountSuccess = createSelector(
  selectAccountManagerState,
  (state) => state.successUpdate
);

export const selectUpdateAccountFail = createSelector(
  selectAccountManagerState,
  (state) => state.errorUpdate
);

export const selectAcademicOptions = createSelector(
  selectAccountManagerState,
  (state) => state.academicOptions
);

export const selectSpecDegreeOptions = createSelector(
  selectAccountManagerState,
  (state) => state.specDegreeOptions
);

export const selectImportAccountFileSuccess  = createSelector(
  selectAccountManagerState,
  (state) => state.success
);

export const selectImportAccountFileFail = createSelector(
  selectAccountManagerState,
  (state) => state.error
);

export const selectDownloadImage = createSelector(
  selectAccountManagerState,
  (state) => state.downloadImage
);

export const selectValidateOptions = createSelector(
  selectAccountManagerState,
  (state) => state.validateOptions
);

export const selectValidateActions = createSelector(
  selectAccountManagerState,
  (state) => state.validateActions
);

export const selectFindAccountImage = createSelector(
  selectAccountManagerState,
  (state) => state.findImage
);
export const selectWareHouse= createSelector(
  selectAccountManagerState,
  (state) => state.wareHouse
);
export const selectUpdatePasswordSuccess= createSelector(
  selectAccountManagerState,
  (state) => state.updatePassword
);

export const selectUpdatePasswordError= createSelector(
  selectAccountManagerState,
  (state) => state.errorUpdatePassword
);

export const selectResetPasswordSuccess= createSelector(
  selectAccountManagerState,
  (state) => state.resetPassword
);

export const selectResetPasswordError= createSelector(
  selectAccountManagerState,
  (state) => state.errorResetPassword
);

export const selectChangeStatusSuccess= createSelector(
  selectAccountManagerState,
  (state) => state.changeStatus
);

export const selectChangeStatusError= createSelector(
  selectAccountManagerState,
  (state) => state.changeStatusError
);

export const selectChangeStatus= createSelector(
  selectAccountManagerState,
  (state) => state.status
);

export const selectChangePasswordError= createSelector(
  selectAccountManagerState,
  (state) => state.errorChangePassword
);
export const selectChangePassword= createSelector(
  selectAccountManagerState,
  (state) => state.changePassword
);
