import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'join'
})
export class JoinPipe implements PipeTransform {

  transform(value: any[] | undefined, separator: string, key: string): unknown {
    return value?.map(t => t[key]).join(separator);
  }

}
