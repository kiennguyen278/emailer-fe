import { createFeatureSelector, createSelector } from '@ngrx/store';
import { userManagerFeatureKey, UserManagerState } from './reducer';

export const selectUserState =
  createFeatureSelector<UserManagerState>(userManagerFeatureKey);


export const selectDataListUser = createSelector(
  selectUserState,
  (state) => {

    const content = [
      {
        "id": '751748921801310208',
        "userName": "admin",
        "status": 1,
        "code": "ADMIN",
        "fullName": "Sys admin",
        "phoneNumber": "09999999",
        "email": "sys@gmail.com",
        "createBy": null,
        "createDate": null,
        "updateBy": null,
        "updateDate": null
      },
      {
        "id": '753792047441248256',
        "userName": "anhlt",
        "status": 1,
        "code": "ANHLT",
        "fullName": "Tuan Anh",
        "phoneNumber": "0999999",
        "email": "anhlt@gmail.com",
        "createBy": "admin",
        "createDate": "2023-09-12T08:40:28",
        "updateBy": null,
        "updateDate": null
      },
      {
        "id": '753886404181753856',
        "userName": "ABC",
        "status": 1,
        "code": "ABC",
        "fullName": "ABC",
        "phoneNumber": "1313213123",
        "email": "3dsf@sdf.sd",
        "createBy": "admin",
        "createDate": "2023-09-12T14:55:25",
        "updateBy": "ABC",
        "updateDate": "2023-09-12T17:34:37"
      },
      {
        "id": '753907311386296320',
        "userName": "ABCD",
        "status": 1,
        "code": "ABCD",
        "fullName": "ABCD",
        "phoneNumber": "3424324242",
        "email": "sfs@sfs.df",
        "createBy": "admin",
        "createDate": "2023-09-12T16:18:29",
        "updateBy": null,
        "updateDate": null
      },
      {
        "id": '754160066440986624',
        "userName": "kien",
        "status": 1,
        "code": "KIEN",
        "fullName": "kien",
        "phoneNumber": "9384928493",
        "email": "sdfns@sfd.sf",
        "createBy": "admin",
        "createDate": "2023-09-13T09:02:51",
        "updateBy": null,
        "updateDate": null
      },
      {
        "id": '754183846995427328',
        "userName": "sfs",
        "status": 1,
        "code": "JJJ",
        "fullName": "jj",
        "phoneNumber": "2342424234",
        "email": "jj@sdgf.sd",
        "createBy": "admin",
        "createDate": "2023-09-13T10:37:21",
        "updateBy": null,
        "updateDate": null
      }
    ];

    // return content;
    return state.userList.data
  }
);

export const selectLoadingListUser = createSelector(
  selectUserState,
  (state) => state.userList.loading
);

export const selectTotalListUser = createSelector(
  selectUserState,
  (state) => state.userList.totalItem
);