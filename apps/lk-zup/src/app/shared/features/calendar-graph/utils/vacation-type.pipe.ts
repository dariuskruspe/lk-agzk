import { Pipe, PipeTransform } from '@angular/core';
import { VacationPeriodInterface } from '../../../../features/vacations/models/vacations.interface';
import { WorkStatusInterface } from '../models/calendar-graph-member-list.interface';

@Pipe({
    name: 'periodType',
    pure: true,
    standalone: false
})
export class PeriodTypePipe implements PipeTransform {
  transform(
    periods: VacationPeriodInterface[] = [],
    types: WorkStatusInterface[] = []
  ): VacationPeriodInterface[] {
    return periods.map((period) => ({
      ...period,
      type: types?.find((type) => type.id === period.typeId),
    }));
  }
}
