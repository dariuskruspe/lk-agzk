import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { MainCurrentUserInterface } from '@features/main/models/main-current-user.interface';
import { VacationsGraphDayOffListInterface } from '@features/vacations/models/vacations-graph-day-off-list.interface';
import { VacationsStatesInterface } from '@features/vacations/models/vacations-states.interface';
import {
  VacationPeriodInterface,
  VacationsInterface,
} from '@features/vacations/models/vacations.interface';
import { EmployeeVacationsService } from '@shared/features/calendar-graph/services/employee-vacations.service';
import { VacationScheduleService } from '@shared/features/calendar-graph/services/vacation-schedule.service';
import { toUnzonedDate } from '@shared/utilits/to-unzoned-date.util';
import moment from 'moment/moment';
import { fromEvent, SubscriptionLike } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { TranslatePipe } from '../../../lang/pipes/lang.pipe';
import { DateClass } from '../../classes/date.class';
import { WorkStatusInterface } from '../../models/calendar-graph-member-list.interface';
import { CalendarGraphInterface } from '../../models/calendar-graph.interface';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'calendar-graph-time-line',
    templateUrl: './calendar-graph-time-line.component.html',
    styleUrls: ['./calendar-graph-time-line.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class CalendarGraphTimeLineComponent
  implements OnInit, OnChanges, AfterViewChecked, OnDestroy
{
  vacationScheduleService: VacationScheduleService = inject(
    VacationScheduleService,
  );

  employeeVacationsService: EmployeeVacationsService = inject(
    EmployeeVacationsService,
  );

  startDay: number;

  startMonth: number;

  monthLength: number[];

  @Input() types: WorkStatusInterface[];

  @Input() trips = false;

  @Input() currentUser: MainCurrentUserInterface;

  @Input() states: VacationsStatesInterface;

  @Input() fullscreen = false;

  @Input() daysOfWeek: string[];

  @Input() months: string[];

  @Input() vacations: VacationsInterface[];

  displayedVacationsSignal: WritableSignal<VacationsInterface[]> =
    this.employeeVacationsService.displayedVacationsSignal;

  @Input() calendarConfig: CalendarGraphInterface;

  @Input() dayOffList: VacationsGraphDayOffListInterface;

  @Output() showInfo = new EventEmitter<{
    event: Event;
    vacation: VacationsInterface;
    period: VacationPeriodInterface;
  }>();

  @Output() openVacation = new EventEmitter<VacationsInterface>();

  @Output() openApproval = new EventEmitter<VacationsInterface>();

  @ViewChild('timeLine') private timeLineRef: ElementRef;

  @ViewChild('employeeList') private employeeListRef: ElementRef;

  namesOffset: string | null = null;

  private scrollSub: SubscriptionLike;

  defaultCalendarConfig = {
    monthView: {
      dayWidthInPixels: 36,
      stepWidthInPixels: 34,
    },
    yearView: {
      dayWidthInPixels: 8,
      stepWidthInPixels: 8,
    },
  };

  selectedDateSignal: WritableSignal<Date> =
    this.vacationScheduleService.selectedDateSignal;

  constructor(
    private ref: ChangeDetectorRef,
    public date: DateClass,
    private translatePipe: TranslatePipe,
  ) {}

  ngOnDestroy(): void {
    if (this.scrollSub) {
      this.scrollSub.unsubscribe();
    }
  }

  ngAfterViewChecked(): void {
    if (this.timeLineRef && this.namesOffset === null && !this.scrollSub) {
      this.scrollSync();

      this.scrollSub = fromEvent<Event>(
        this.timeLineRef.nativeElement,
        'scroll',
      )
        .pipe(
          debounceTime(300),
          filter(
            (event) =>
              (event.target as HTMLElement).ownerDocument.body.clientWidth <=
              991,
          ),
          distinctUntilChanged(
            undefined,
            (event) => (event.target as HTMLElement).scrollLeft,
          ),
        )
        .subscribe((event) => {
          this.namesOffset = `${(event.target as HTMLElement).scrollLeft}px`;
          this.ref.detectChanges();
        });
    }
  }

  ngOnInit(): void {
    this.ref.detach();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.calendarConfig && changes.calendarConfig.currentValue) {
      this.buildCalendar();
      this.ref.detectChanges();
    }
    if (changes.vacations && changes.vacations.currentValue) {
      this.ref.detectChanges();
    }
  }

  scrollSync(): void {
    if (!this.timeLineRef || !this.employeeListRef) return;

    const timeline = this.timeLineRef.nativeElement;
    const employeeList = this.employeeListRef.nativeElement;

    timeline.addEventListener('scroll', () => {
      employeeList.scrollTop = timeline.scrollTop;
    });

    employeeList.addEventListener('scroll', () => {
      timeline.scrollTop = employeeList.scrollTop;
    });
  }

  buildCalendar(): void {
    if (
      this.calendarConfig &&
      this.calendarConfig.showType &&
      this.calendarConfig.date
    ) {
      const sDate = new Date(this.calendarConfig.date);
      const startDate = new Date(sDate.getFullYear(), sDate.getMonth(), 1);
      this.startMonth = startDate.getMonth();
      this.startDay = startDate.getDay();
      this.monthLength = new Array(
        this.calendarConfig.endDate
          ? this.monthDiff(
              this.calendarConfig.date,
              this.calendarConfig.endDate,
            ) + 1
          : 1,
      );
    }
  }

  monthDiff(d1: string, d2: string): number {
    let months;
    months = (new Date(d2).getFullYear() - new Date(d1).getFullYear()) * 12;
    months -= new Date(d1).getMonth() + 1;
    months += new Date(d2).getMonth() + 1;
    return months <= 0 ? 0 : months;
  }

  showDateInfo(
    event: Event,
    vacation: VacationsInterface,
    period: VacationPeriodInterface,
  ): void {
    this.showInfo.emit({ event, vacation, period });
  }

  getDaysInMonth(month: number): unknown[] {
    const startYear = new Date(this.calendarConfig.date).getFullYear();
    return new Array(new Date(startYear, month + 1, 0).getDate());
  }

  getPeriodsCoincidence(
    periods: VacationPeriodInterface[],
    deltaMonth: number,
  ): VacationPeriodInterface[] {
    const startYear = new Date(this.calendarConfig.date).getFullYear();
    const currentMonth = new Date(startYear, deltaMonth, 1);
    const nextMonth = new Date(startYear, deltaMonth + 1, 0);
    if (this.calendarConfig.showType === 'month') {
      const periodsArr = [];
      periods.forEach((period) => {
        const periodStart = new Date(period.startDate);
        const periodEnd = new Date(period.endDate);

        if (periodStart.getMonth() !== periodEnd.getMonth()) {
          const originalStartDate = period.originalStartDate ?? period.startDate;
          const originalEndDate = period.originalEndDate ?? period.endDate;

          let current = new Date(periodStart.getFullYear(), periodStart.getMonth(), 1);
          const last = new Date(periodEnd.getFullYear(), periodEnd.getMonth(), 1);

          while (current <= last) {
            const mIdx = current.getMonth();
            const mStart = new Date(startYear, mIdx, 1);
            const mEnd = new Date(startYear, mIdx + 1, 0, 23, 59, 59);

            const rStart = periodStart > mStart ? periodStart : mStart;
            const rEnd = periodEnd < mEnd ? periodEnd : mEnd;

            if (rStart <= rEnd) {
              periodsArr.push({
                ...period,
                startDate: toUnzonedDate(rStart).toISOString(),
                endDate: toUnzonedDate(rEnd).toISOString(),
                originalStartDate,
                originalEndDate,
                tooltip: this.getPeriod({
                  ...period,
                  startDate: originalStartDate,
                  endDate: originalEndDate,
                }),
              });
            }
            current.setMonth(current.getMonth() + 1);
          }
        } else {
          periodsArr.push(period);
        }
      });
      // eslint-disable-next-line no-param-reassign
      periods = periodsArr;
    }

    return periods.filter((period) => {
      const periodStart = new Date(period.startDate);
      return currentMonth <= periodStart && nextMonth >= periodStart;
    });
  }

  getOffset(point: VacationPeriodInterface): number {
    const startDate = new Date(point.startDate).getDate();
    const typeOffset =
      this.calendarConfig.showType === 'month'
        ? this.defaultCalendarConfig.monthView.dayWidthInPixels || 36
        : this.defaultCalendarConfig.yearView.dayWidthInPixels || 8;
    return startDate * typeOffset - typeOffset + 1;
  }

  getWidth(point: VacationPeriodInterface): number {
    const periodLength = this.date.getDateDiff(point.startDate, point.endDate);
    const stepWidth =
      this.calendarConfig.showType === 'month'
        ? this.defaultCalendarConfig.monthView.stepWidthInPixels || 34
        : this.defaultCalendarConfig.yearView.stepWidthInPixels || 8;
    const marginsWidth = periodLength === 1 ? 0 : (periodLength - 1) * 2;
    return (
      periodLength * stepWidth +
      (this.calendarConfig.showType === 'month' ? marginsWidth : 0)
    );
  }

  trackByIndex(index: number): number {
    return index;
  }

  trackByDates(index: number, period: VacationPeriodInterface): string {
    return period.startDate + period.endDate;
  }

  openMemberVacation(vacation: VacationsInterface): void {
    this.openVacation.emit(vacation);
  }

  getPeriod(point: VacationPeriodInterface): string {
    if (!point || !point.startDate || !point.endDate) return '';
    return (
      moment(point.startDate).format('DD.MM.YYYY').toString() +
      ' - ' +
      moment(point.endDate).format('DD.MM.YYYY').toString()
    );
  }

  onOpenApproval(value: VacationsInterface): void {
    this.openApproval.next(value);
  }

  getColor(point: VacationPeriodInterface): string {
    return this.trips && point.linkedIssueId
      ? 'var(--done)'
      : point.type?.color;
  }
}
