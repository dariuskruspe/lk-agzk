import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CardModule } from 'primeng/card';
import {
  AppCalendarComponent,
  AppCalendarMonthValue,
  AppCalendarInputDay,
} from '@app/shared/components/app-calendar/app-calendar.component';
import {
  TimesheetApiService,
  TimesheetMapper,
  TimesheetScheduleCalendarDay,
  TimesheetScheduleResponse,
} from '@app/shared/features/timesheet-schedule';
import { LocalStorageService } from '@app/shared/services/local-storage.service';
import { autoaborted } from '@app/shared/utilits/autoaborted';
import moment from 'moment';
import { Observable } from 'rxjs';
import { IWidgetComponent } from '../../shared/widget.interface';
import { mapTimesheetScheduleDayToAppCalendarInputDay } from './dashboard-v2-calendar-widget-day-adapter';

@Component({
  selector: 'app-dashboard-v2-calendar-widget',
  standalone: true,
  imports: [CardModule, AppCalendarComponent],
  templateUrl: './dashboard-v2-calendar-widget.component.html',
  styleUrl: './dashboard-v2-calendar-widget.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardV2CalendarWidgetComponent implements IWidgetComponent {
  private localStorageService = inject(LocalStorageService);
  private timesheetApiService = inject(TimesheetApiService);
  private timesheetMapper = inject(TimesheetMapper);

  autoaborted = autoaborted();
  loading = toSignal(this.autoaborted.loading$);

  loading$ = this.autoaborted.loading$;

  month = signal<AppCalendarMonthValue>([
    new Date().getFullYear(),
    new Date().getMonth(),
  ]);

  data = signal<TimesheetScheduleCalendarDay[]>([]);

  days = computed<AppCalendarInputDay[]>(() => {
    return this.data().map(this.mapToDayInput);
  });

  private mapToDayInput = (
    item: TimesheetScheduleCalendarDay,
  ): AppCalendarInputDay =>
    mapTimesheetScheduleDayToAppCalendarInputDay(item, this.timesheetMapper);

  constructor() {
    effect(() => {
      this.fetch(this.month());
    });
  }

  fetch([year, month]: AppCalendarMonthValue) {
    const employeeId = this.localStorageService.getCurrentEmployeeId();

    if (!employeeId) {
      this.data.set([]);
      return;
    }

    this.autoaborted({
      obs: this.loadCalendarDays(employeeId, [year, month]),
      next: (data: TimesheetScheduleCalendarDay[]) => {
        this.data.set(data);
      },
      error: () => {
        this.data.set([]);
      },
    });
  }

  private loadCalendarDays(
    employeeId: string,
    [year, month]: AppCalendarMonthValue,
  ): Observable<TimesheetScheduleCalendarDay[]> {
    const startDate = moment([year, month, 1])
      .startOf('month')
      .format('YYYY-MM-DD');
    const endDate = moment([year, month, 1])
      .endOf('month')
      .format('YYYY-MM-DD');

    return new Observable<TimesheetScheduleCalendarDay[]>((subscriber) => {
      const abortController = new AbortController();

      void this.timesheetApiService
        .getSchedule(
          employeeId,
          {
            startDate,
            endDate,
          },
          abortController.signal,
        )
        .then((response) => {
          subscriber.next(this.pickEmployeeCalendar(response, employeeId));
          subscriber.complete();
        })
        .catch((error: unknown) => {
          if (abortController.signal.aborted) {
            subscriber.complete();
            return;
          }

          subscriber.error(error);
        });

      return () => abortController.abort();
    });
  }

  private pickEmployeeCalendar(
    response: TimesheetScheduleResponse,
    employeeId: string,
  ): TimesheetScheduleCalendarDay[] {
    const row =
      response.find((item) => item.employee.id === employeeId) ?? response[0];

    return row?.calendar ?? [];
  }
}
