import { Pipe, PipeTransform } from '@angular/core';
import { BooleanToStringHelper } from '@shared/helpers';

@Pipe({
  name: 'booleanToString',
})
export class BooleanToStringPipe implements PipeTransform {
  transform(value: boolean): string {
    return BooleanToStringHelper.transform(value);
  }
}
