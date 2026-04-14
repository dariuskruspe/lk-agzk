import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filter',
    pure: true,
    standalone: false
})
export class FilterPipe<T> implements PipeTransform {
  transform(
    source: T[],
    field: keyof T,
    value: unknown,
    possibleEmpty: boolean = false
  ): T[] {
    if (possibleEmpty && !value) {
      return [];
    }
    if (!possibleEmpty && !value) {
      return source;
    }
    return [...(source || []).filter((item) => item[field] === value)];
  }
}
