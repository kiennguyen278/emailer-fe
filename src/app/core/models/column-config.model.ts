import { TemplateRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NzTableSortOrder } from 'ng-zorro-antd/table/src/table.types';
import { Observable } from 'rxjs';
import { OptionGroupModel, OptionModel } from './option.model';

export interface ColumnConfig {
  key: string;
  header: string;
  sortable?: boolean;
  pipe?: string; //
  tdClass?: string | any;
  thClass?: string;
  contentClass?: any;
  filter?: {
    type?: 'input' | 'select' | 'datepicker' | 'inputNumber' | 'mention' | 'timepicker';
    options?: OptionModel<any>[] | any[];
    options$?: Observable<OptionModel[]> | Observable<any[]>;
    defaultValue?: string | any;
  };
  templateColumn?: TemplateRef<any>;
  nzWidth?: string;
  isDefault?: boolean;
  alwaysShow?: boolean;
  template?: string; // 👈 thêm dòng này
}
