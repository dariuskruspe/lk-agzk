import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'take', pure: true,
    standalone: false
})
export class TakePipe implements PipeTransform {
  transform<T>(value: T[], count?: number): T[] {
    if (value) {
      return !count ? value : value.slice(0, count);
    }
    return value;
  }
}
