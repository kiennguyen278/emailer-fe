import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { CellTemplateDirective } from '@shared/directives/cell-template.directive';
import { get, isEmpty } from 'lodash';
import { NzTableComponent, NzTableQueryParams } from 'ng-zorro-antd/table';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { FormControl, FormGroup } from '@angular/forms';
import { DATE_FORMAT } from '@core/constants';
import { ObjUtil } from '@core/utils/obj.util';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import {ColumnConfig} from "@core/models/column-config.model";
import {Pagination} from "@core/models/pagination.model";
import {TableQueryParams} from "@core/models/table-query-params.model";
import {OptionModel} from "@core/models/option.model";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent
  implements OnInit, OnChanges, AfterContentInit, OnDestroy, AfterViewInit
{
  @ContentChildren(CellTemplateDirective, {})
  cellTemplates: QueryList<CellTemplateDirective>;
  @Input() key = 'id';
  @Input() columns: Array<ColumnConfig> = [];
  @Input() displayColumns: string[] = [];
  @Input() items: any[] = [];
  @Input() pagination: Pagination = { index: 1, size: 10, total: 0 };
  @Input() loading: boolean | null = null;
  @Input() showPagination: boolean = true;
  @Input() showCheckbox: boolean = false;
  @Input() showDrag: boolean = false;
  @Input() showIndex: boolean = false;
  @Input() rowTemplate!: TemplateRef<any>;
  @Input() scrollY: string = '';
  @Input() scrollX: string;
  @Input() checkedKeys: any[] = [];
  @Input() selectOnlyOne = false;
  @Input() disableAllCheck = false;
  @Input() checkAll = false;
  @Input() bgColorByItem: any;
  @Input() debounceTime = 500;
  @Input() clearFilter = new FormControl();
  @Input() showHightlightRow = false;
  @Input() clearCheckedKey: boolean = false;
  @Input() setOfCheckedKeys = new Set<any>();
  @Input() isLoadOnScroll = false;
  @Input() isShowSetting = false;
  @Output() queryParams = new EventEmitter<TableQueryParams>();
  @Output() dbClickItem = new EventEmitter<any>();
  @Output() clickItem = new EventEmitter<any>();
  @Output() checkedKeysChange = new EventEmitter<any[]>();
  @Output() itemSelected = new EventEmitter<any[]>();
  @Output() byLoadmore = new EventEmitter();

  @Input() enableDragDrop = false;
  @Output() byDrop = new EventEmitter<CdkDragDrop<any>>();

  // @Output() onSetting = new EventEmitter();
  @ViewChild('tableRef') tableRef: NzTableComponent<any>;
  checked = false;
  displayedColumns: ColumnConfig[] = [];
  indeterminate = false;
  lastSort?: {
    key: string;
    value: 'ascend' | 'descend' | null;
  };
  filter: { [key: string]: any } = {};
  newRowForm: FormGroup = new FormGroup({});
  filterOptions: { [key: string]: OptionModel[] } = {};
  scroll: any = {};
  searchChange$ = new Subject<void>();
  scroll$ = new Subject<void>();
  dateTime = DATE_FORMAT;
  hightLightIndex: number = 0;
  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    if (this.displayColumns && !this.displayColumns.length) {
      this.displayedColumns = this.columns;
    }
    this.columns.forEach((column) => {
      if(column.filter?.defaultValue){
        this.filter[column.key] = column.filter?.defaultValue;
      }
      column.filter?.options$?.subscribe((options) => {
        column.filter!.options = options;
        this.cdr.markForCheck();
      });
    });
    if (this.scrollX) {
      this.scroll = { x: this.scrollX };
    }
    if (this.scrollY) {
      this.scroll = { ...this.scroll, y: this.scrollY };
    }
    if (this.isLoadOnScroll) {
      this.pagination = { index: 1, size: 20, total: 0 };
    }

    // this.searchChange$
    //   .asObservable()
    //   .pipe(debounceTime(this.debounceTime))
    //   .subscribe(() => {
    //     this.onScrollToBottom();
    //   });
    this.searchChange$
      .asObservable()
      .pipe(debounceTime(this.debounceTime))
      .subscribe(() => {
        this.onChangeFilter();
      });
    this.scroll$
      .asObservable()
      .pipe(debounceTime(this.debounceTime))
      .subscribe(() => {
        this.onScrollToBottom();
      });
  }

  ngAfterContentInit(): void {
    this.displayedColumns
      .filter((t) => t.pipe === 'template')
      ?.forEach((t) => {
        const cell = (
          this.cellTemplates.find(
            (cell) => t.key === cell.key
          ) as CellTemplateDirective
        )?.templateRef;
        t.templateColumn = cell;
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.clearCheckedKey === true) {
      this.setOfCheckedKeys.clear();
      this.refreshCheckedStatus();
    }
    if (this.clearFilter.value) {
      this.filter = new Object();
    }
    if (this.checkAll == true) {
      this.onAllChecked(true);
    }
    const { displayColumns, items, checkedKeys } = changes;
    if (displayColumns) {
      this.displayedColumns = this.displayColumns.map((key) => {
        return {
          ...this.columns.find((col) => col.key == key)!,
          templateColumn: (
            this.cellTemplates?.find(
              (cell) => key === cell.key
            ) as CellTemplateDirective
          )?.templateRef
        };
      });
    }
    if (checkedKeys) {
      this.setOfCheckedKeys.clear();
      this.checkedKeys.forEach((key) => this.setOfCheckedKeys.add(key));
      this.refreshCheckedStatus();
    }
    if (items) {
      this.refreshCheckedStatus();
      if (this.isLoadOnScroll) {
        this.items = this.items?.map((x: any, index: number) => ({
          ...x,
          index: index
        }));
      };

      if(this.showHightlightRow && !isEmpty(items.currentValue)){
        this.onClickItem(items.currentValue[0], 0)
      }

    }
  }

  ngAfterViewInit(): void {
    if (this.isLoadOnScroll) {
      this.tableRef?.cdkVirtualScrollViewport?.scrolledIndexChange.subscribe(
        (index: number) => {
          const wrongNumber = 10;
          const current =
            this.tableRef.cdkVirtualScrollViewport!.measureScrollOffset('top');
          const scrollY = +this.scrollY.split('px')[0];
          const measure =
            this.tableRef.cdkVirtualScrollViewport!.measureRenderedContentSize() -
            scrollY -
            wrongNumber;
          if (
            current > 0 &&
            current >= measure &&
            this.pagination.total > this.items.length
          ) {
            this.scroll$.next();
          }
        }
      );
    }
  }

  trackByIndex(_: number, data: any): number {
    return data.index;
  }

  onIndexChange(pageIndex: number) {
    this.queryParams.next({ pageIndex });
  }

  onSizeChange(pageSize: number) {
    if (this.pagination.total > 10 && pageSize > 10) {
      this.scroll = { x: this.scrollX, y: this.scrollY };
    } else {
      this.scroll = { x: this.scrollX };
    }
    this.queryParams.next({ pageSize });
  }

  onQueryParams(params: NzTableQueryParams) {
    if (params.sort) {
      const sort = params.sort.find((x) => x.value);
      if (!sort) {
        if (!this.lastSort) return;
        return this.queryParams.next({
          sort: { key: this.lastSort.key, value: null }
        });
      }
      this.lastSort = { key: sort.key, value: sort?.value as any };
      this.queryParams.next({
        sort: this.lastSort
      });
    }
  }

  onScrollToBottom() {
    this.byLoadmore.emit();
  }

  onDbClickItem(item: any) {
    this.dbClickItem.next(item);
  }

  onClickItem(item: any, index?: number | any) {
    this.clickItem.next(item);

    if (this.showHightlightRow){
      Number.isInteger(index) && this.hightLightRow(index);
    }

  }

  hightLightRow(index: number){
    this.hightLightIndex = index
  }

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedKeys.add(id);
    } else {
      this.setOfCheckedKeys.delete(id);
    }
  }

  onItemChecked(id: number, checked: boolean): void {
    if (this.selectOnlyOne) {
      this.setOfCheckedKeys.clear();
    }
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus(true);
  }

  onAllChecked(value: boolean): void {
    this.items.forEach((item) => this.updateCheckedSet(item[this.key], item.isDisableCheckbox ? false : value));
    this.refreshCheckedStatus(true);
  }

  refreshCheckedStatus(emitEvent = false): void {
    this.checked =
      this.items?.length > 0 &&
      this.items.every((item) => this.setOfCheckedKeys.has(item[this.key]));
    this.indeterminate =
      this.items?.some((item) => this.setOfCheckedKeys.has(item[this.key])) &&
      !this.checked;
    if (emitEvent) {
      this.checkedKeysChange.emit(Array.from(this.setOfCheckedKeys.values()));
      this.itemSelected.emit(
        this.items?.filter((data) => this.setOfCheckedKeys.has(data.id))
      );
    }

  }

  stopPropagation(e: Event) {
    e.stopPropagation();
  }

  onChangeFilterDelay() {
    this.searchChange$.next();
  }

  onChangeFilter() {
    this.queryParams.next({ filter: ObjUtil.trim(this.filter) });
  }

  getValue(item: any, key: string) {
    return get(item, key) ?? '';
  }


  getValueBoolean(item: any, key: string) {
    return get(item, key) ?? '';
  }

  colorByRow(index: number) {
    return index % 2 === 0;
  }

  ngOnDestroy() {
    this.searchChange$.complete();
    this.scroll$.complete();
  }


  onDragDrop(event: CdkDragDrop<any[]>): void {
    this.byDrop.emit(event)

  }
  // onClickSetting() {
  //   this.onSetting.emit();
  // }
}
