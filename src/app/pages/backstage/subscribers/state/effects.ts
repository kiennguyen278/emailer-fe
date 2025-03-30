import {Injectable} from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as Actionss from './actions';
import { SubscribersService } from './service';
import { SubscriberSearchDTO } from '../models';

@Injectable()
export class UserManagerEffects {

  constructor(
    private actions$: Actions,
    private subscribersService: SubscribersService,
  ) {
  }

  getListTags$ = createEffect(() =>
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

  getListSubscribers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(Actionss.getListSubscribers),
      switchMap(({ payload }: {payload: SubscriberSearchDTO}) => {
        return this.subscribersService.getListSubscribers(payload).pipe(
          map((res: any) => Actionss.getListSubscribersSuccess(res.data)),
          catchError((error) => of(Actionss.getListSubscribersFail({ error })))
        );
      })
    )
  );

}
