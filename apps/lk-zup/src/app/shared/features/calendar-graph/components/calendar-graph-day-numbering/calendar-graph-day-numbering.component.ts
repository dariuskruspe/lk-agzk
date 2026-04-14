import { Component, Input } from '@angular/core';
import { VacationsGraphDayOffListInterface } from '../../../../../features/vacations/models/vacations-graph-day-off-list.interface';
import { DateClass } from '../../classes/date.class';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'calendar-graph-day-numbering',
    templateUrl: './calendar-graph-day-numbering.component.html',
    styleUrls: ['./calendar-graph-day-numbering.component.scss'],
    standalone: false
})
export class CalendarGraphDayNumberingComponent {
  @Input() startDate: string;

  @Input() dayNumberList: string[];

  @Input() monthInd: number;

  @Input() showDaysOff: boolean;

  @Input() dayOffList: VacationsGraphDayOffListInterface;

  @Input() showType: 'month' | 'year';

  constructor(public date: DateClass) {}
}
