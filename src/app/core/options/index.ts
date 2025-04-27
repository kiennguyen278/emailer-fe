import { OptionModel } from '@core/models';



export const OptionScheduledStatusValue = {
  DRAFT: 'DRAFT',
  SCHEDULED: 'SCHEDULED',
  SENT: 'SENT',
  CANCELLED: 'CANCELLED',
}

export const OptionScheduledStatus: OptionModel[] = [
  {label: 'DRAFT', value: OptionScheduledStatusValue.DRAFT},
  {label: 'SCHEDULED', value: OptionScheduledStatusValue.SCHEDULED},
  {label: 'SENT', value: OptionScheduledStatusValue.SENT},
  {label: 'CANCELLED', value: OptionScheduledStatusValue.CANCELLED},
]


export const Status = {
  ACTIVE: 1, // value truyền lên cho BE sẽ là ACTIVE hoặc INACTIVE
  INACTIVE: 0,
}


export const OptionDelayDate: OptionModel<Number>[] = [
  // {label: 'After 0 day', value: 0},
  {label: 'After 1 day', value: 1},
  {label: 'After 2 days', value: 2},
  {label: 'After 3 days', value: 3},
  {label: 'After 4 days', value: 4},
  {label: 'After 5 days', value: 5},
  {label: 'After 6 days', value: 6},
  {label: 'After 7 days', value: 7},
];


export const CampainStatusOptions: OptionModel[] = [
  {label: 'Đang gửi', value: 'SCHEDULED'},
  {label: 'Dừng gửi', value: 'PAUSED'},
  {label: 'Hủy gửi', value: 'CANCELLED'},
]
