import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  VacationPeriodInterface,
  VacationsInterface,
} from '../../../../../features/vacations/models/vacations.interface';
import {
  CALENDER_CONFIG_EN,
  CALENDER_CONFIG_RU,
} from '../../../../dictionaries/calendar-locale.dictionary';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'calendar-graph-mobile-intersection',
    templateUrl: './calendar-graph-mobile-intersection.component.html',
    styleUrls: ['./calendar-graph-mobile-intersection.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class CalendarGraphMobileIntersectionComponent implements OnChanges {
  @Input() periods: {
    employeeName: string;
    startDate: Date;
    endDate: Date;
    daysLength: number;
    type: string;
    color: string;
    approved: null | boolean;
    fullVacation: VacationsInterface;
    period: VacationPeriodInterface;
    hasIntersection: boolean;
  }[];

  @Input() monthNumber: number;

  @Input() dateLocale: string;

  monthDays: {
    number: number;
    dayOfWeek: string;
  }[] = [];

  periodsByDays: {
    employeeName: string;
    days: {
      color: string;
    }[];
  }[] = [];

  month: string;

  year: number;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.periods && changes.periods.currentValue.length) {
      let config;
      if (this.dateLocale === 'ru') {
        config = CALENDER_CONFIG_RU;
      } else {
        config = CALENDER_CONFIG_EN;
      }
      this.month = config.monthNames[this.monthNumber];
      this.year = this.periods[0].endDate.getFullYear();
      this.monthDays = [];
      this.periodsByDays = [];
      const countOfDays = new Date(
        this.periods[0].endDate.getFullYear(),
        this.periods[0].endDate.getMonth() + 1,
        0,
      ).getDate();
      for (let i = 1; i <= countOfDays; i++) {
        const numberOfWeek = new Date(
          this.periods[0].endDate.getFullYear(),
          this.monthNumber,
          i,
        )
          .getDay()
          .toString();
        const dayOfWeek = config.dayNamesMin[numberOfWeek];
        this.monthDays.push({
          number: i,
          dayOfWeek,
        });
      }
      this.periods.forEach((period) => {
        const days: {
          color: string;
        }[] = [];
        this.monthDays.forEach((day) => {
          const date = new Date(
            this.periods[0].endDate.getFullYear(),
            this.periods[0].endDate.getMonth(),
            day.number,
          );
          if (
            this.dateInPeriod(
              date,
              new Date(period.startDate),
              new Date(period.endDate),
            )
          ) {
            days.push({
              color: period?.color,
            });
          } else {
            days.push({
              color: '#D3DBE3',
            });
          }
        });
        this.periodsByDays.push({
          employeeName: period.employeeName,
          days,
        });
      });
    }
  }

  dateInPeriod(date: Date, startDate: Date, endDate: Date): boolean {
    return date >= startDate && date <= endDate;
  }
}
