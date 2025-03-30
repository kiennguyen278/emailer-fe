import { Pipe, PipeTransform } from '@angular/core';
import {OptionModel} from "@core/models/option.model";

@Pipe({
  name: 'optionClass'
})
export class OptionClassPipe implements PipeTransform {
  transform(value: any, options?: OptionModel<any>[]): any {
    return options?.find((option) => option.value === value)?.class;
  }
}
