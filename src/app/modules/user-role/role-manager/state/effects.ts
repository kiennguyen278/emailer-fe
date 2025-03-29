import {Injectable} from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as RoleManagerActions from './actions';
import { RoleManagerServices } from './service';
import {
  GetListRoleRequest,
  GetListRoleResponsed, GetListUserAddToRoleRequest,
  GetListUserInRoleRequest,
  SaveRoleItemRequest
} from '@modules/user-role/role-manager/models';

@Injectable()
export class RoleManagerEffects {

  constructor(
    private actions$: Actions,
    private roleManagerServices: RoleManagerServices,
  ) {
  }

  getListRoles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RoleManagerActions.loadListRole),
      switchMap(({ payload }: {payload: GetListRoleRequest}) => {
        return this.roleManagerServices.getListRoles(payload).pipe(
          map((res: GetListRoleResponsed) =>
            RoleManagerActions.loadListRoleSuccess(res)
          ),
          catchError((error) =>
            of(RoleManagerActions.loadListRoleFail({ error }))
          )
        );
      })
    )
  );

  saveRoleItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RoleManagerActions.saveRoleItem),
      switchMap(({ payload }: {payload: SaveRoleItemRequest}) => {
        return this.roleManagerServices.saveRoleItem(payload).pipe(
          map((res: GetListRoleResponsed) =>
            RoleManagerActions.saveRoleItemSuccess(res)
          ),
          catchError((error) =>
            of(RoleManagerActions.saveRoleItemFail({ error }))
          )
        );
      })
    )
  );


  getListUserInRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RoleManagerActions.getListUserInRole),
      switchMap(({ payload }: {payload: GetListUserInRoleRequest}) => {
        return this.roleManagerServices.getListUserInRole(payload).pipe(
          map((res: GetListRoleResponsed) =>
            RoleManagerActions.getListUserInRoleSuccess(res)
          ),
          catchError((error) =>
            of(RoleManagerActions.getListUserInRoleFail({ error }))
          )
        );
      })
    )
  );

  getListUserAddToRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RoleManagerActions.getListUserAddToRole),
      switchMap(({ payload }: {payload: GetListUserAddToRoleRequest}) => {
        return this.roleManagerServices.getListUserAddToRole(payload).pipe(
          map((res: GetListRoleResponsed) =>
            RoleManagerActions.getListUserAddToRoleSuccess(res)
          ),
          catchError((error) =>
            of(RoleManagerActions.getListUserAddToRoleFail({ error }))
          )
        );
      })
    )
  );



}
