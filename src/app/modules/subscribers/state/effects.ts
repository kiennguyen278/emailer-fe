import {Injectable} from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as RoleManagerActions from './actions';
import { SubscribersService } from './service';
import { GetListUserRequest } from '@modules/user-role/user-manager/models';

@Injectable()
export class UserManagerEffects {

  constructor(
    private actions$: Actions,
    private subscribersService: SubscribersService,
  ) {
  }

  // getListRoles$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(RoleManagerActions.getListUser),
  //     switchMap(({ payload }: {payload: GetListUserRequest}) => {
  //       return this.userManagerServices.getListUser(payload).pipe(
  //         map((res: any) =>
  //           RoleManagerActions.getListUserSuccess(res)
  //         ),
  //         catchError((error) =>
  //           of(RoleManagerActions.getListUserFail({ error }))
  //         )
  //       );
  //     })
  //   )
  // );

}
