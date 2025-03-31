import {Injectable} from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as Actionss from './actions';
import {EmailService} from "./service";

@Injectable()
export class EmailEffects {

  constructor(
    private actions$: Actions,
    private service: EmailService,
  ) {
  }

  getListEmailTemplate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(Actionss.getListEmailTemplate),
      switchMap(() => {
        return this.service.getAllEmailTemplate().pipe(
          map((data) => Actionss.getListEmailTemplateSuccess(data)),
          catchError(({ error }) => of(Actionss.getListEmailTemplateFail(error.error)))
        )
      }),
    )
  );


}
