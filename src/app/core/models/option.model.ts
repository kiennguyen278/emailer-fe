export interface OptionModel<T = string> {
  value: T;
  label: string;
  shortCode?: string;
  class?: string;
  disabled?: boolean;
  checked?: boolean;
  [key: string]: any;
}

export interface OptionGroupModel<T = string> {
  value: T;
  options: OptionModel[]
}

export interface OptionGroupLabel {
  label: string;
  key: string
}
