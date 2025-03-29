import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rowspan'
})
export class RowSpanPipe implements PipeTransform {

  transform(value: number, add: any[], substract: any[]): unknown {
    return value + add.filter(x => x).length - substract.filter(x => x).length;
  }

}
