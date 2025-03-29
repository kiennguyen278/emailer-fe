import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationComponent implements OnChanges {
  @Input() total = 0;
  @Input() index = 1;
  @Input() size = 10;
  @Input() sizeOptions = [10, 20, 30, 40, 50];
  @Output() indexChange = new EventEmitter<number>();
  @Output() sizeChange = new EventEmitter<number>();
  ranges = [0, 0];
  pages: any[] = [];

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    const { total, size, index } = changes;
    if (total) {
      this.onTotalChange(this.total);
    }
    if (index || size || total) {
      this.ranges = [
        this.total ? (this.index - 1) * this.size + 1 : 0,
        Math.min(this.index * this.size, this.total)
      ];
      this.buildIndexes();
    }
  }

  onIndexChange(index: number): void {
    const lastIndex = this.getLastIndex(this.total, this.size);
    const validIndex = this.validatePageIndex(index, lastIndex);
    if (validIndex !== this.index) {
      this.index = validIndex;
      this.buildIndexes();
      this.indexChange.emit(this.index);
    }
  }

  onSizeChange(size: number): void {
    this.size = size;
    this.sizeChange.emit(size);
    const lastIndex = this.getLastIndex(this.total, this.size);
    if (this.index > lastIndex) {
      this.onIndexChange(lastIndex);
    }
  }

  onTotalChange(total: number): void {
    const lastIndex = this.getLastIndex(total, this.size);
    if (this.index > lastIndex) {
      this.onIndexChange(lastIndex);
      this.cdr.markForCheck();
    }
  }

  prePage(): void {
    this.onIndexChange(this.index - 1);
  }

  nextPage(): void {
    this.onIndexChange(this.index + 1);
  }

  firstPage(): void {
    this.onIndexChange(1);
  }

  lastPage(): void {
    this.onIndexChange(this.getLastIndex(this.total, this.size));
  }

  private getLastIndex(total: number, size: number): number {
    return Math.ceil(total / size);
  }

  private validatePageIndex(value: number, lastIndex: number): number {
    if (value > lastIndex) {
      return lastIndex;
    } else if (value < 1) {
      return 1;
    } else {
      return value;
    }
  }

  private buildIndexes(): void {
    const lastIndex = this.getLastIndex(this.total, this.size);
    this.pages = this.getListOfPageItem(this.index, lastIndex);
  }

  private getListOfPageItem(
    pageIndex: number,
    lastIndex: number
  ): Array<Partial<any>> {
    const concatWithPrevNext = (listOfPage: Array<Partial<any>>) => {
      const prevItem = {
        type: 'prev',
        disabled: pageIndex === 1
      };
      const nextItem = {
        type: 'next',
        disabled: pageIndex === lastIndex
      };
      const firstPageItem = {
        type: 'first',
        disabled: pageIndex === 1
      };
      const lastPageItem = {
        type: 'last',
        disabled: pageIndex === lastIndex
      };
      return [firstPageItem, prevItem, ...listOfPage, nextItem, lastPageItem];
    };
    const generatePage = (start: number, end: number): Array<Partial<any>> => {
      const list = [];
      for (let i = start; i <= end; i++) {
        list.push({
          index: i,
          type: 'page'
        });
      }
      return list;
    };
    if (lastIndex <= 9) {
      return concatWithPrevNext(generatePage(1, lastIndex));
    } else {
      const generateRangeItem = (selected: number, last: number) => {
        let listOfRange = [];
        if (selected < 5) {
          const maxLeft = selected === 4 ? 6 : 5;
          listOfRange = generatePage(1, maxLeft);
        } else if (selected < last - 3) {
          listOfRange = generatePage(selected - 2, selected + 2);
        } else {
          const minRight = selected === last - 3 ? last - 5 : last - 4;
          listOfRange = generatePage(minRight, last - 1);
        }
        return listOfRange;
      };
      return concatWithPrevNext(generateRangeItem(pageIndex, lastIndex));
    }
  }
}
