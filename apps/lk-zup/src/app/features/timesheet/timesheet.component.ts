import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  DestroyRef,
  effect,
  inject,
  resource,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { AppButtonComponent } from '@app/shared/components/app-button/app-button.component';
import { AppMonthSelectComponent } from '@app/shared/components/app-month-select/app-month-select.component';
import { LangModule } from '@app/shared/features/lang/lang.module';
import {
  TimesheetScheduleDayType,
  TimesheetScheduleMode,
  TimesheetScheduleRow,
  TimesheetTimeType,
} from '@app/shared/features/timesheet-schedule/models/timesheet-schedule.interface';
import {
  ArrowDownToLineIcon,
  PlusIcon,
  SlidersHorizontalIcon,
} from 'lucide-angular';

import { map } from 'rxjs';
import {
  GridComponent,
  GridHeaderComponent,
  GridBodyComponent,
  GridRowComponent,
  GridColComponent,
} from '@app/shared/features/grid';
import { TimesheetApiService } from '@app/shared/features/timesheet-schedule/services/timesheet-api.service';
import { UserStateService } from '@app/shared/states/user-state.service';
import { AppCalendarMonthValue } from '@app/shared/components/app-calendar/app-calendar.component';
import moment from 'moment';
import { UtilsService } from '@app/shared/services/utils.service';
import { TimesheetDayCell } from './timesheet-day-cell/timesheet-day-cell';
import {
  TimesheetDayStyle,
  TimesheetMapper,
} from '@app/shared/features/timesheet-schedule';
import { TimesheetLegend } from './timesheet-legend/timesheet-legend';
import {
  TimesheetLegendItem,
  TimesheetLegendItemVariant,
} from './timesheet-legend/timesheet-legend.interface';
import { AppSpinner } from '@app/shared/components/app-spinner';
import { CalendarGraphMonth } from '@app/shared/features/calendar-graph-v2/calendar-graph-month/calendar-graph-month';
import {
  CalendarGraphMonthConfig,
  CalendarGraphMonthDay,
} from '@app/shared/features/calendar-graph-v2/calendar-graph-month/types';
import { TimesheetRowVm } from './types';
import { TimesheetEmployeeNameCell } from './timesheet-employee-name-cell/timesheet-employee-name-cell';
import { TimesheetSummaryCell } from './timesheet-summary-cell/timesheet-summary-cell';
import { CalendarGraphMonthService } from '@app/shared/features/calendar-graph-v2/calendar-graph-month/calendar-graph-month.service';
import { BindStickyClassDirective } from '@app/shared/directives/bind-sticky-class.directive';
import {
  createDefaultTimesheetRouteState,
  createTimesheetRouteQueryKey,
  normalizeTimesheetRouteQueryParams,
  parseTimesheetRouteState,
  serializeTimesheetRouteState,
  TimesheetRouteState,
} from './shared/timesheet-route-state';

@Component({
  selector: 'app-timesheet',
  imports: [
    BindStickyClassDirective,
    AppMonthSelectComponent,
    LangModule,
    TimesheetLegend,
    AppSpinner,
    CalendarGraphMonth,
  ],
  providers: [CalendarGraphMonthService],
  templateUrl: './timesheet.component.html',
  styleUrl: './timesheet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TimesheetComponent {
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private timesheetApiService = inject(TimesheetApiService);
  private userState = inject(UserStateService);
  readonly activeEmployeeId = this.userState.activeEmployeeId;
  private utils = inject(UtilsService);
  private calendarGraphMonthService = inject(CalendarGraphMonthService);
  private timesheetMapper = inject(TimesheetMapper);
  private hiddenLegendTimeTypes = new Set<TimesheetTimeType>([
    'Рабочий день',
    'Выходной день',
    'Заявка',
  ]);
  private pendingIssueLegendItem: TimesheetLegendItem = {
    id: 'pending-issue-approval',
    label: 'Заявка на согласовании',
    variant: 'warning',
  };
  private hourLegendItems: TimesheetLegendItem[] = [
    {
      id: 'hours-plan',
      label: 'Заплан.часы',
      variant: 'hours',
      value: '8',
      color: 'var(--timesheet-summary-text, #989aa2)',
    },
    {
      id: 'hours-fact',
      label: 'Факт.часы',
      variant: 'hours',
      value: 'ф8',
      color: 'var(--timesheet-note-text, #f26f61)',
    },
  ];
  private routeDefaults = createDefaultTimesheetRouteState();
  private routeState = signal<TimesheetRouteState>(
    parseTimesheetRouteState(
      this.route.snapshot.queryParams,
      this.routeDefaults,
    ),
  );

  month = signal<AppCalendarMonthValue>([
    this.routeState().year,
    this.routeState().month,
  ]);
  mode = toSignal(
    this.route.data.pipe(
      map(
        (data) =>
          (data['mode'] as TimesheetScheduleMode | undefined) ?? 'my_timesheet',
      ),
    ),
    {
      initialValue:
        (this.route.snapshot.data['mode'] as
          | TimesheetScheduleMode
          | undefined) ?? 'my_timesheet',
    },
  );

  constructor() {
    this.route.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((queryParams) => {
        const nextRouteState = parseTimesheetRouteState(
          queryParams,
          this.routeDefaults,
        );

        this.routeState.set(nextRouteState);

        const nextMonth: AppCalendarMonthValue = [
          nextRouteState.year,
          nextRouteState.month,
        ];

        if (!this.isSameMonth(this.month(), nextMonth)) {
          this.month.set(nextMonth);
        }
      });

    effect(() => {
      const routeState: TimesheetRouteState = {
        year: this.month()[0],
        month: this.month()[1],
      };
      const currentQueryKey = normalizeTimesheetRouteQueryParams(
        this.route.snapshot.queryParams,
        this.routeDefaults,
      );
      const nextQueryKey = createTimesheetRouteQueryKey(
        routeState,
        this.routeDefaults,
      );

      if (currentQueryKey === nextQueryKey) {
        return;
      }

      void this.router.navigate([], {
        relativeTo: this.route,
        queryParams: serializeTimesheetRouteState(
          routeState,
          this.routeDefaults,
        ),
        queryParamsHandling: '',
        replaceUrl: true,
      });
    });
  }

  data = resource({
    request: () => ({
      employeeId: this.userState.activeEmployeeId(),
      month: this.month(),
      mode: this.mode(),
    }),
    loader: ({ request, abortSignal }) => {
      const d = moment([request.month[0], request.month[1], 1]).startOf(
        'month',
      );
      const end = d.clone().endOf('month');

      return this.timesheetApiService.getSchedule(
        request.employeeId,
        {
          startDate: d.format('YYYY-MM-DD'),
          endDate: end.format('YYYY-MM-DD'),
          mode: request.mode,
        },
        abortSignal,
      );
    },
  });

  calendarGraphMonthConfig = computed(
    () =>
      ({
        dayCellRender: (row: unknown, day: CalendarGraphMonthDay) => ({
          component: TimesheetDayCell,
          styleClass: 'timesheet-day-cell',
        }),
        minDayColWidth: 32,
        trackBy: (row: TimesheetScheduleRow) => row.employee.id,
        headerSticky: {
          top: 'var(--main-top-offset, 16px)',
        },
        targetCell: {
          cellRender: {
            component: TimesheetEmployeeNameCell,
            sizePx: 150,
            styleClass: 'timesheet-target-cell',
          },
          header: '',
        },
        summaryCell: {
          cellRender: {
            component: TimesheetSummaryCell,
            sizePx: 40,
            styleClass: 'timesheet-summary-cell',
          },
          header: 'Итого',
        },
      }) satisfies CalendarGraphMonthConfig,
  );

  rows = computed<TimesheetRowVm[]>(() => {
    const data = this.data.value();
    if (!data) return [];

    return data.map(this.mapRow);
  });

  legendItems = computed<TimesheetLegendItem[]>(() => {
    const data = this.data.value();
    if (!data) return [];

    const uniqueDayTypes = new Map<string, TimesheetScheduleDayType>();

    for (const row of data) {
      for (const day of row.calendar) {
        for (const dayType of day.dayType) {
          uniqueDayTypes.set(dayType.name, dayType);
        }
      }
    }

    const dayLegendItems = Array.from(uniqueDayTypes.values())
      .filter(
        (day) =>
          day.timeType === '' || !this.hiddenLegendTimeTypes.has(day.timeType),
      )
      .map((day) => ({
        item: this.mapLegendItem(day),
        order: this.getLegendOrder(day),
      }))
      .sort((a, b) => a.order - b.order)
      .map(({ item }) => item);

    return [
      this.pendingIssueLegendItem,
      ...dayLegendItems,
      ...this.hourLegendItems,
    ];
  });

  mapRow = ({ employee, calendar }: TimesheetScheduleRow) => {
    const days = calendar.map(this.timesheetMapper.mapDay);

    const employeeDisplayName = this.utils.getEmployeeShortName(employee.name);

    const summaryHours = days.reduce((acc, day) => acc + (day.hours || 0), 0);
    const summaryHoursFact = days.reduce(
      (acc, day) => acc + (day.hoursFact || 0),
      0,
    );

    return {
      employeeDisplayName,
      employee,
      canOpenIssue:
        this.mode() === 'team_timesheet' ||
        employee.id === this.activeEmployeeId(),
      days,
      summaryHours,
      summaryHoursFact,
    };
  };

  private mapLegendItem = (
    day: TimesheetScheduleDayType,
  ): TimesheetLegendItem => {
    const style = this.timesheetMapper.mapDayStyles(day);

    return {
      id: `${day.calendarType}-${day.timeType || 'custom'}-${day.name}`,
      label: day.name,
      variant: this.getLegendVariant(day, style),
      color: style.color ?? 'var(--timesheet-summary-text, #989aa2)',
      backgroundColor: style.bgColor ?? null,
      icon:
        style.iconKind === 'lucide' &&
        style.icon &&
        typeof style.icon !== 'string'
          ? style.icon
          : null,
      iconClass:
        style.iconKind === 'custom' && typeof style.icon === 'string'
          ? this.resolveCustomIconClass(style.icon)
          : null,
    };
  };

  private getLegendVariant = (
    day: TimesheetScheduleDayType,
    style: TimesheetDayStyle,
  ): TimesheetLegendItemVariant => {
    const normalizedName = day.name.toLowerCase();

    if (day.onApproval || normalizedName.includes('согласован')) {
      return 'warning';
    }

    if (
      day.timeType === 'Командировка' ||
      day.timeType === 'Работа в выходной'
    ) {
      return 'icon';
    }

    if (day.timeType === 'Больничный') {
      return 'filled';
    }

    if (day.timeType === 'Отпуск' && day.calendarType === 'fact') {
      return 'filled';
    }

    if (day.timeType === 'Отпуск' && day.calendarType === 'plan') {
      return 'outlined';
    }

    if (style.bgColor) {
      return 'filled';
    }

    if (style.icon || style.color) {
      return 'outlined';
    }

    return 'filled';
  };

  private getLegendOrder = (legend: TimesheetScheduleDayType) => {
    const normalizedName = legend.name.toLowerCase();

    if (legend.onApproval || normalizedName.includes('согласован')) return 10;
    if (legend.timeType === 'Больничный') return 20;
    if (legend.timeType === 'Отпуск' && legend.calendarType === 'fact')
      return 30;
    if (legend.timeType === 'Отпуск' && legend.calendarType === 'plan')
      return 40;
    if (legend.timeType === 'Командировка') return 50;
    if (normalizedName.includes('индив')) return 60;

    return 100;
  };

  private resolveCustomIconClass = (icon: string) => {
    if (!icon) return null;
    if (icon.startsWith('icon-')) return `hrm-icons ${icon}`;
    if (icon.startsWith('pi')) return icon;

    return `pi pi-${icon}`;
  };

  private isSameMonth(
    [yearA, monthA]: AppCalendarMonthValue,
    [yearB, monthB]: AppCalendarMonthValue,
  ): boolean {
    return yearA === yearB && monthA === monthB;
  }

  isCurrentEmployeeRow(item: { employee: { id: string } }): boolean {
    const id = this.activeEmployeeId();
    return id != null && item.employee.id === id;
  }

  ArrowDownToLineIcon = ArrowDownToLineIcon;
  PlusIcon = PlusIcon;
  SlidersHorizontalIcon = SlidersHorizontalIcon;
}
