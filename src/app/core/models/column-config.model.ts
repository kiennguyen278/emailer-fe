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
  control?: string;
  controlName?: string;
  isDefault?: boolean;
  alwaysShow?: boolean;
  newRow?: NewRow;
  action? : {
    isEdit?: boolean;
    isAdd?: boolean;
    isDelete?: boolean;
  },
}

export interface GroupItem {
  label: string;
  key: string;
  items: any[];
  isActive?: boolean;
  newRowForm?: FormGroup;
  isShowNewRow?: boolean;
  action? : {
    isEdit?: boolean;
    isAdd?: boolean;
  },
  isRequired?: boolean;
}

export interface NewRow {
  key?: string;
  type?: 'input' | 'select' | 'datepicker' | 'inputNumber' | 'mention' | 'action';
  headers?: {
    label: string;
    key: string;
  }[];
  options?: OptionModel<any>[] | any[];
  options$?: Observable<OptionModel[]> | Observable<any[]>;
  isTable?: boolean; // if select is displayed as table
  isExtendWidth?: boolean; // unmatch nz select dropdown width
  validate?: any[];
  updateKeysOnSelect?: string[];
  onApiSearch?: any;
  byLoadmore?: any;
  isApiSearch?: boolean;
}
