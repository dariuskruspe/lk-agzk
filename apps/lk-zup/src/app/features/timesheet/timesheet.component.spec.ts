import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TimesheetMapper } from '@app/shared/features/timesheet-schedule';
import { CalendarGraphMonthService } from '@app/shared/features/calendar-graph-v2/calendar-graph-month/calendar-graph-month.service';
import {
  TimesheetScheduleDayType,
  TimesheetScheduleRow,
} from '@app/shared/features/timesheet-schedule/models/timesheet-schedule.interface';
import { TimesheetApiService } from '@app/shared/features/timesheet-schedule/services/timesheet-api.service';
import { UtilsService } from '@app/shared/services/utils.service';
import { UserStateService } from '@app/shared/states/user-state.service';
import { BehaviorSubject, of } from 'rxjs';
import { TimesheetComponent } from './timesheet.component';

jest.mock('@app/shared/states/user-state.service', () => ({
  UserStateService: class UserStateService {},
}));

describe('TimesheetComponent', () => {
  const setup = ({
    queryParams = {},
    scheduleData = [],
    mode = 'my_timesheet',
  }: {
    queryParams?: Params;
    scheduleData?: TimesheetScheduleRow[];
    mode?: 'my_timesheet' | 'team_timesheet';
  } = {}) => {
    const queryParams$ = new BehaviorSubject<Params>(queryParams);
    const router = {
      navigate: jest.fn().mockResolvedValue(true),
    };
    const getSchedule = jest.fn().mockResolvedValue(scheduleData);
    const route = {
      data: of({
        mode,
      }),
      queryParams: queryParams$.asObservable(),
      snapshot: {
        data: {
          mode,
        },
        queryParams,
      },
    };

    TestBed.configureTestingModule({
      providers: [
        {
          provide: ActivatedRoute,
          useValue: route,
        },
        {
          provide: Router,
          useValue: router,
        },
        {
          provide: TimesheetApiService,
          useValue: {
            getSchedule,
          },
        },
        {
          provide: UserStateService,
          useValue: {
            activeEmployeeId: signal('employee-1'),
          },
        },
        {
          provide: UtilsService,
          useValue: {
            getEmployeeShortName: jest.fn((value: string) => value),
          },
        },
        {
          provide: TimesheetMapper,
          useValue: {
            mapDay: jest.fn((day) => ({
              date: day.date,
              day: 0,
              dayTypes: day.dayType,
              variant: 'text',
              hasUnapprovedIssues: false,
              hours: day.hoursCountPlan,
              hoursFact: day.hoursCountActual,
              iconKind: 'lucide',
              icon: null,
              color: null,
              bgColor: null,
            })),
            mapDayStyles: jest.fn(() => ({
              iconKind: 'lucide',
              icon: null,
              color: null,
              bgColor: null,
            })),
          },
        },
        {
          provide: CalendarGraphMonthService,
          useValue: {},
        },
      ],
    });

    const component = TestBed.runInInjectionContext(
      () => new TimesheetComponent(),
    );

    TestBed.flushEffects();

    return { component, queryParams$, router, route, getSchedule };
  };

  it('should configure calendar graph month with sticky header and numeric side width', () => {
    const { component } = setup();
    const config = component.calendarGraphMonthConfig();

    expect(config.minDayColWidth).toBe(32);
    expect(config.targetCell?.cellRender.sizePx).toBe(150);
    expect(config.headerSticky?.top).toBe('var(--main-top-offset, 16px)');
  });

  it('should restore month from query params on init', () => {
    const { component } = setup({
      queryParams: {
        year: '2026',
        month: '3',
      },
    });

    expect(component.month()).toEqual([2026, 3]);
  });

  it('should use current month when query params are missing', () => {
    const currentDate = new Date();
    const { component } = setup();

    expect(component.month()).toEqual([
      currentDate.getFullYear(),
      currentDate.getMonth(),
    ]);
  });

  it('should use current month when query params are invalid', () => {
    const currentDate = new Date();
    const { component } = setup({
      queryParams: {
        year: 'invalid',
        month: '99',
      },
    });

    expect(component.month()).toEqual([
      currentDate.getFullYear(),
      currentDate.getMonth(),
    ]);
  });

  it('should sync month from query params changes', () => {
    const { component, queryParams$ } = setup({
      queryParams: {
        year: '2026',
        month: '3',
      },
    });

    queryParams$.next({
      year: '2027',
      month: '5',
    });
    TestBed.flushEffects();

    expect(component.month()).toEqual([2027, 5]);
  });

  it('should save month changes to query params', () => {
    const { component, router } = setup({
      queryParams: {
        year: '2026',
        month: '3',
      },
    });

    router.navigate.mockClear();

    component.month.set([2027, 5]);
    TestBed.flushEffects();

    expect(router.navigate).toHaveBeenCalledWith([], {
      relativeTo: expect.anything(),
      queryParams: {
        month: '5',
        year: '2027',
      },
      queryParamsHandling: '',
      replaceUrl: true,
    });
  });

  it('should replace request legend with static pending label', async () => {
    const { component } = setup({
      scheduleData: [
        createScheduleRow([
          createDayType({
            name: 'Заявка',
            timeType: 'Заявка',
            onApproval: true,
          }),
          createDayType({
            name: 'Больничный',
            timeType: 'Больничный',
          }),
          createDayType({
            name: 'Командировка',
            timeType: 'Командировка',
          }),
        ]),
      ],
    });

    await flushResource();

    const legendLabels = component.legendItems().map((item) => item.label);

    expect(legendLabels).toEqual([
      'Заявка на согласовании',
      'Больничный',
      'Командировка',
      'Заплан.часы',
      'Факт.часы',
    ]);
    expect(legendLabels).not.toContain('Заявка');
    expect(
      component
        .legendItems()
        .filter((item) => item.label === 'Заявка на согласовании'),
    ).toHaveLength(1);
  });

  it('should keep static pending label when schedule has no request days', async () => {
    const { component } = setup({
      scheduleData: [
        createScheduleRow([
          createDayType({
            name: 'Отпуск',
            timeType: 'Отпуск',
            calendarType: 'fact',
          }),
        ]),
      ],
    });

    await flushResource();

    expect(component.legendItems().map((item) => item.label)).toEqual([
      'Заявка на согласовании',
      'Отпуск',
      'Заплан.часы',
      'Факт.часы',
    ]);
  });

  it('should allow opening issues for colleague rows in team mode', async () => {
    const { component } = setup({
      mode: 'team_timesheet',
    });
    const mappedRow = component.mapRow(
      createScheduleRow(
        [
          createDayType({
            name: 'Командировка',
            issueId: 'issue-1',
            timeType: 'Командировка',
          }),
        ],
        {
          id: 'employee-2',
          name: 'Петров Петр',
          position: 'Developer',
        },
      ),
    );

    expect(mappedRow.canOpenIssue).toBe(true);
  });

  it('should keep colleague issue opening disabled outside team mode', async () => {
    const { component } = setup({
      mode: 'my_timesheet',
    });
    const mappedRow = component.mapRow(
      createScheduleRow(
        [
          createDayType({
            name: 'Командировка',
            issueId: 'issue-1',
            timeType: 'Командировка',
          }),
        ],
        {
          id: 'employee-2',
          name: 'Петров Петр',
          position: 'Developer',
        },
      ),
    );

    expect(mappedRow.canOpenIssue).toBe(false);
  });
});

async function flushResource(): Promise<void> {
  await Promise.resolve();
  await Promise.resolve();
  TestBed.flushEffects();
}

function createScheduleRow(
  dayType: TimesheetScheduleDayType[],
  employee: TimesheetScheduleRow['employee'] = {
    id: 'employee-1',
    name: 'Иванов Иван',
    position: 'Developer',
  },
): TimesheetScheduleRow {
  return {
    employeeDisplayName: 'Иванов И.И.',
    employee,
    calendar: [
      {
        date: '2026-04-01',
        dayType,
        hoursCountActual: 8,
        hoursCountPlan: 8,
        hoursCountDifference: 0,
      },
    ],
  };
}

function createDayType(
  overrides: Partial<TimesheetScheduleDayType> = {},
): TimesheetScheduleDayType {
  return {
    name: 'Рабочий день',
    color: '',
    iconName: '',
    issueId: '',
    stateId: '',
    code: '',
    onApproval: false,
    hoursCountActual: 8,
    hoursCountPlan: 8,
    hoursCountDifference: 0,
    timeType: 'Рабочий день',
    calendarType: 'fact',
    ...overrides,
  };
}
