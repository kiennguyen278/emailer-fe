import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import {
  ColumnConfig,
  OptionModel,
  Pagination,
  TableQueryParams
} from '@core/models';
import { DefaultProjectorFn, MemoizedSelector, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, takeUntil, skip } from 'rxjs/operators';
import { BaseDestroyComponent } from './base-destroy.component';
import { isNil, omitBy } from 'lodash';
import { SORT_DIRECTION } from '@core/constants';
import { ObjUtil } from '@core/utils/obj.util';

@Component({
  template: ''
})
export abstract class BaseCrudListComponent<T = any>
  extends BaseDestroyComponent
  implements OnInit {
  items: T[] = [];
  pagination: Pagination = { index: 1, size: 30, total: 0 };
  columns: ColumnConfig[] = [];
  displayColumns: string[] = [];


  selectLoading: MemoizedSelector<object, boolean, DefaultProjectorFn<boolean>>;
  selectItems: MemoizedSelector<object, T[], DefaultProjectorFn<T[]>>;
  selectTotal: MemoizedSelector<object, number, DefaultProjectorFn<number>>;
  findItemsAction: (arg: { payload: any }) => any;
  loading$: Observable<boolean>;
  params: any = {};
  currentPageNum: number;

  constructor(
    protected store: Store<any>,
    protected activatedRoute: ActivatedRoute,
    protected cdr: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit() {
    this.findItems();
    this.onInitFn();
  }

  onInitFn() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      if (params.page) {
        this.currentPageNum = Number(params.page);
      }
    });

    if (!this.displayColumns.length) {
      this.displayColumns = this.columns.map((col) => col.key);
    }

    this.loading$ = this.store.select(this.selectLoading);

    this.store
      .select(this.selectItems)
      .pipe(takeUntil(this.destroy$))
      .subscribe((items) => {
        this.items = items;
        this.cdr.detectChanges();
      });

    this.store
      .select(this.selectTotal)
      .pipe(takeUntil(this.destroy$))
      .subscribe((total) => (this.pagination = { ...this.pagination, total }));
  }

  findItems(payload: any = {}) {
    this.store.dispatch(
      this.findItemsAction({
        payload: { ...omitBy(this.getParams(), isNil), ...payload }
      })
    );
  }

  onQueryParams(params: TableQueryParams) {
    if (params.filter) {
      this.params = params.filter;
    }
    if (params.sort) {
      this.params.sorts = params.sort.value
        ? [`${params.sort.key}-${SORT_DIRECTION[params.sort.value]}`]
        : undefined;
    }
    this.pagination.index = params.pageIndex || this.currentPageNum || 1;
    this.pagination.size = params.pageSize || this.pagination.size;
    this.findItems(ObjUtil.deleteNullProp(this.getParams()));
  }

  getParams() {
    return omitBy(
      {
        page: this.currentPageNum || this.pagination.index,
        size: this.pagination.size,
        ...this.params
      },
      isNil
    );
  }
}
