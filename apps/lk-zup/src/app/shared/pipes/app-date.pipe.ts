import { Pipe, PipeTransform } from '@angular/core';
import moment, { MomentInput } from 'moment';

@Pipe({
    name: 'appDate',
    pure: true,
    standalone: false
})
export class AppDatePipe implements PipeTransform {
  transform(source: MomentInput): string {
    const d = moment(source);
    const date = new Date();
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    const nowNoTimezone = new Date(date.getTime() + userTimezoneOffset);
    return d.from(nowNoTimezone);
  }
}
