import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseErrorModel } from '@core/models';
import { NotificationService } from '@core/services/notification.service';
import { DefaultProjectorFn, MemoizedSelector, Store } from '@ngrx/store';
import { isEqual } from 'lodash';
import { combineLatest, Observable, of } from 'rxjs';
import { first, skip, takeUntil } from 'rxjs/operators';
import { BaseDestroyComponent } from './base-destroy.component';

@Component({
  template: ''
})
export abstract class BaseCrudFormComponent<T = any>
  extends BaseDestroyComponent
  implements OnInit
{
  id!: string;
  form!: FormGroup;
  selectLoading!: MemoizedSelector<
    object,
    boolean,
    DefaultProjectorFn<boolean>
  >;
  selectSuccess!: MemoizedSelector<object, T, DefaultProjectorFn<T>>;
  selectError!: MemoizedSelector<
    object,
    ResponseErrorModel,
    DefaultProjectorFn<ResponseErrorModel>
  >;
  loading$!: Observable<boolean>;
  success$!: Observable<any>;
  error$!: Observable<ResponseErrorModel>;
  formModified = false;

  constructor(
    protected fb: FormBuilder,
    protected store: Store<any>,
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
    protected notificationService: NotificationService
  ) {
    super();
  }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.params.id;
    this.loading$ =
      this.selectLoading &&
      this.store
        .select(this.selectLoading)
        .pipe(skip(1), takeUntil(this.destroy$));
    this.success$ =
      this.selectSuccess &&
      this.store
        .select(this.selectSuccess)
        .pipe(skip(1), takeUntil(this.destroy$));
    this.error$ =
      this.selectError &&
      this.store
        .select(this.selectError)
        .pipe(skip(1), takeUntil(this.destroy$));
  }

  subscribeValueChange() {
    combineLatest([
      this.id ? this.form.valueChanges.pipe(first()) : of(this.form.value),
      this.form.valueChanges
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([original, newValue]) => {
        this.formModified = !isEqual(original, newValue);
      });
  }
}
