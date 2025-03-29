import {Injectable} from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as Actionss from './actions';
import { SubscribersService } from './service';

@Injectable()
export class UserManagerEffects {

  constructor(
    private actions$: Actions,
    private subscribersService: SubscribersService,
  ) {
  }

  getMachineListEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(Actionss.getListTags),
      switchMap(() => {
        return this.subscribersService.getAllTag().pipe(
          map((data) => Actionss.getListTagsSuccess(data)),
          catchError(({ error }) => of(Actionss.getListTagsFail(error.error)))
        )
      }),
    )
  );

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
