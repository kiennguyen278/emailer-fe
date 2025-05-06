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
  {label: 'Immediately', value: 0},
  {label: 'After 1 day', value: 1},
  {label: 'After 2 days', value: 2},
  {label: 'After 3 days', value: 3},
  {label: 'After 4 days', value: 4},
  {label: 'After 5 days', value: 5},
  {label: 'After 6 days', value: 6},
  {label: 'After 7 days', value: 7},
  {label: 'After 8 days', value: 8},
  {label: 'After 9 days', value: 9},
  {label: 'After 10 days', value: 10},
  {label: 'After 11 days', value: 11},
  {label: 'After 12 days', value: 12},
  {label: 'After 13 days', value: 13},
  {label: 'After 14 days', value: 14},
  {label: 'After 15 days', value: 15},
  {label: 'After 16 days', value: 16},
  {label: 'After 17 days', value: 17},
  {label: 'After 18 days', value: 18},
  {label: 'After 19 days', value: 19},
  {label: 'After 20 days', value: 20},
  {label: 'After 21 days', value: 21},
  {label: 'After 22 days', value: 22},
  {label: 'After 23 days', value: 23},
  {label: 'After 24 days', value: 24},
  {label: 'After 25 days', value: 25},
  {label: 'After 26 days', value: 26},
  {label: 'After 27 days', value: 27},
  {label: 'After 28 days', value: 28},
  {label: 'After 29 days', value: 29},
  {label: 'After 30 days', value: 30},
];


export const CampainStatusOptions: OptionModel[] = [
  {label: 'Đang gửi', value: 'SCHEDULED'},
  {label: 'Dừng gửi', value: 'PAUSED'},
  {label: 'Hủy gửi', value: 'CANCELLED'},
]
