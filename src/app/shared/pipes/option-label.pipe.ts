import { Pipe, PipeTransform } from '@angular/core';
import { OptionModel } from '@core/models';

@Pipe({
  name: 'optionLabel'
})
export class OptionLabelPipe implements PipeTransform {
  transform(value: any, options?: OptionModel<any>[]): any {
    return options?.find((option) => option.value === value)?.label;
  }
}
