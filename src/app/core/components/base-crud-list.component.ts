import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  ColumnConfig,
  OptionModel,
  Pagination,
  TableQueryParams
} from '@core/models';
import { DefaultProjectorFn, MemoizedSelector, Store } from '@ngrx/store';
// import { TableColSettingsComponent } from '@shared/components/table-col-settings/table-col-settings.component';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { Observable } from 'rxjs';
import { filter, takeUntil, skip } from 'rxjs/operators';
import { BaseDestroyComponent } from './base-destroy.component';
import { isNil, omitBy } from 'lodash';
import { NotificationService } from '@core/services/notification.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { FormBuilder } from '@angular/forms';
import { SORT_DIRECTION } from '@core/constants';
import { ObjUtil } from '@core/utils/obj.util';
// import * as SettingsAction from 'src/app/state/settings/settings.actions';
// import { selectSettingsColData } from '../../state/settings/settings.selectors';
// import { DataService } from '@core/services/data.service';

@Component({
  template: ''
})
export abstract class BaseCrudListComponent<T = any>
  extends BaseDestroyComponent
  implements OnInit {
  items: T[] = [];
  pagination: Pagination = { index: 1, size: 10, total: 0 };
  columns: ColumnConfig[] = [];
  displayColumns: string[] = [];


  selectLoading: MemoizedSelector<object, boolean, DefaultProjectorFn<boolean>>;
  selectItems: MemoizedSelector<object, T[], DefaultProjectorFn<T[]>>;
  selectTotal: MemoizedSelector<object, number, DefaultProjectorFn<number>>;
  findItemsAction: (arg: { payload: any }) => any;
  loading$: Observable<boolean>;
  params: any = {};
  keySaveSettingCol: string = '';
  currentPageNum: number;

  constructor(
    protected store: Store<any>,
    protected router: Router,
    protected drawer: NzDrawerService,
    protected notification: NotificationService,
    protected modal: NzModalService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
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
      .subscribe((items) => (this.items = items));

    this.store
      .select(this.selectTotal)
      .pipe(takeUntil(this.destroy$))
      .subscribe((total) => (this.pagination = { ...this.pagination, total }));
    // this.getSettingCols();
    // this.showColFollowSetting();
  }

  findItems(payload: any = {}) {
    this.store.dispatch(
      this.findItemsAction({
        payload: { ...omitBy(this.getParams(), isNil), ...payload }
      })
    );
  }

  getSettingCols() {
    console.log('getSettingCols')
    // if (this.keySaveSettingCol) {
    //   this.store.dispatch(
    //     SettingsAction.getColsDisplay({
    //       payload: { keySetting: this.keySaveSettingCol }
    //     })
    //   );
    // }
  }

  saveSettingCols(listColDisplay: string[]) {
    console.log('saveSettingCols', listColDisplay)
    // if (this.keySaveSettingCol) {
    //   this.store.dispatch(
    //     SettingsAction.saveColsDisplay({
    //       payload: {
    //         settingName: this.keySaveSettingCol,
    //         jsonSetting: { displayCols: listColDisplay }
    //       }
    //     })
    //   );
    // }
  }

  showColFollowSetting() {
    // this.store
    //   .select(selectSettingsColData)
    //   .pipe(skip(1), takeUntil(this.destroy$))
    //   .subscribe((data) => {
    //     if (!data || data.length == 0) {
    //       return;
    //     }
    //     const itemFilter = data.find(
    //       (item) => item.key == this.keySaveSettingCol
    //     )!;
    //     if (this.keySaveSettingCol) {
    //       this.displayColumns = itemFilter.values.displayCols;
    //     }
    //   });
  }

  openColSettings() {
    // this.drawer
    //   .create({
    //     nzContent: TableColSettingsComponent,
    //     nzContentParams: {
    //       columns: this.columns,
    //       displayColumns: this.displayColumns
    //     },
    //     nzClosable: false,
    //     nzWidth: '355px',
    //     nzBodyStyle: { padding: '0' }
    //   })
    //   .afterClose.pipe(filter((v) => v))
    //   .subscribe((cols) => {
    //     this.displayColumns = cols;
    //     this.saveSettingCols(cols);
    //   });
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
