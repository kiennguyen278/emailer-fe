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

