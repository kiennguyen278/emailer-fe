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


  getListEmailCampaign$ = createEffect(() =>
    this.actions$.pipe(
      ofType(Actionss.getListEmailCampaign),
      switchMap(() => {
        return this.service.getAllEmailCampaign().pipe(
          map((data) => Actionss.getListEmailCampaignSuccess(data)),
          catchError(({ error }) => of(Actionss.getListEmailCampaignFail(error.error)))
        )
      }),
    )
  );

  getListEmailSequence$ = createEffect(() =>
    this.actions$.pipe(
      ofType(Actionss.getListSequence),
      switchMap(() => {
        return this.service.getAllSequence().pipe(
          map((data) => Actionss.getListSequenceSuccess(data)),
          catchError((error) => of(Actionss.getListSequenceFail(error)))
        )
      }),
    )
  );


}
