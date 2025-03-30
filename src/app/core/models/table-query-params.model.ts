export interface TableQueryParams {
  pageIndex?: number;
  pageSize?: number;
  sort?: {
    key: string;
    value: 'ascend' | 'descend' | null;
  };
  filter?: { [key: string]: any };
}
