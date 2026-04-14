import { Component, Input } from '@angular/core';
import { DateClass } from '../../classes/date.class';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'calendar-graph-month-point',
    templateUrl: './calendar-graph-month-point.component.html',
    styleUrls: ['./calendar-graph-month-point.component.scss'],
    standalone: false
})
export class CalendarGraphMonthPointComponent {
  @Input() startDate: string;

  @Input() monthInd: number;

  @Input() monthNameList: string[];

  @Input() showType: 'month' | 'year';

  constructor(public date: DateClass) {}
}
