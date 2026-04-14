import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogService } from 'primeng/dynamicdialog';
import { CalendarGraphMonthDay } from '@app/shared/features/calendar-graph-v2/calendar-graph-month/types';
import { TimesheetScheduleDayType } from '@app/shared/features/timesheet-schedule';
import { TimesheetDayDetailsDialogComponent } from '../timesheet-day-details-dialog/timesheet-day-details-dialog.component';
import { TimesheetDayCell } from './timesheet-day-cell';

describe('TimesheetDayCell', () => {
  let fixture: ComponentFixture<TimesheetDayCell>;

  const dialogServiceMock = {
    open: jest.fn(),
  };

  beforeEach(async () => {
    dialogServiceMock.open.mockReset();

    await TestBed.configureTestingModule({
      imports: [TimesheetDayCell, NoopAnimationsModule],
      providers: [{ provide: DialogService, useValue: dialogServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(TimesheetDayCell);
  });

  it('should open day details dialog with selected day payload on click', () => {
    const dayType = createDayType({
      name: 'Командировка',
      issueId: 'issue-42',
      timeType: 'Командировка',
    });

    fixture.componentRef.setInput('row', {
      employeeDisplayName: 'Иванов И.И.',
      employee: {
        id: 'employee-1',
        name: 'Иванов Иван Иванович',
        position: 'Разработчик',
      },
      canOpenIssue: true,
      days: [
        {
          date: '2026-02-03',
          day: 2,
          dayTypes: [dayType],
          variant: 'text',
          hasUnapprovedIssues: false,
          hours: 8,
          hoursFact: 6,
          iconKind: 'lucide',
          icon: null,
          color: null,
          bgColor: null,
        },
      ],
      summaryHours: 8,
      summaryHoursFact: 6,
    });
    fixture.componentRef.setInput('day', createCalendarDay());
    fixture.detectChanges();

    const cell = fixture.nativeElement.querySelector(
      '.timesheet-cell',
    ) as HTMLDivElement;

    cell.click();

    expect(dialogServiceMock.open).toHaveBeenCalledWith(
      TimesheetDayDetailsDialogComponent,
      {
        width: '640px',
        data: {
          employeeName: 'Иванов И.И.',
          date: '2026-02-03',
          hoursPlan: 8,
          hoursFact: 6,
          dayTypes: [dayType],
          canOpenIssue: true,
        },
        closable: true,
        dismissableMask: true,
      },
    );
  });

  it('should mark linked issue as unavailable for colleague row', () => {
    const dayType = createDayType({
      name: 'Командировка',
      issueId: 'issue-42',
      timeType: 'Командировка',
    });

    fixture.componentRef.setInput('row', {
      employeeDisplayName: 'Петров П.П.',
      employee: {
        id: 'employee-2',
        name: 'Петров Петр Петрович',
        position: 'Разработчик',
      },
      canOpenIssue: false,
      days: [
        {
          date: '2026-02-03',
          day: 2,
          dayTypes: [dayType],
          variant: 'text',
          hasUnapprovedIssues: false,
          hours: 8,
          hoursFact: 6,
          iconKind: 'lucide',
          icon: null,
          color: null,
          bgColor: null,
        },
      ],
      summaryHours: 8,
      summaryHoursFact: 6,
    });
    fixture.componentRef.setInput('day', createCalendarDay());
    fixture.detectChanges();

    const cell = fixture.nativeElement.querySelector(
      '.timesheet-cell',
    ) as HTMLDivElement;

    cell.click();

    expect(dialogServiceMock.open).toHaveBeenCalledWith(
      TimesheetDayDetailsDialogComponent,
      {
        width: '640px',
        data: {
          employeeName: 'Петров П.П.',
          date: '2026-02-03',
          hoursPlan: 8,
          hoursFact: 6,
          dayTypes: [dayType],
          canOpenIssue: false,
        },
        closable: true,
        dismissableMask: true,
      },
    );
  });

  it('should build compact tooltip text from all day types', () => {
    fixture.componentRef.setInput('row', {
      employeeDisplayName: 'Иванов И.И.',
      employee: {
        id: 'employee-1',
        name: 'Иванов Иван Иванович',
        position: 'Разработчик',
      },
      canOpenIssue: true,
      days: [
        {
          date: '2026-02-03',
          day: 2,
          dayTypes: [
            createDayType({
              name: 'Рабочее время',
              hoursCountPlan: 8,
              hoursCountActual: 8,
            }),
            createDayType({
              name: 'Работа ночью',
              hoursCountPlan: 8,
              hoursCountActual: 4,
            }),
          ],
          variant: 'text',
          hasUnapprovedIssues: false,
          hours: 8,
          hoursFact: 6,
          iconKind: 'lucide',
          icon: null,
          color: null,
          bgColor: null,
        },
      ],
      summaryHours: 8,
      summaryHoursFact: 6,
    });
    fixture.componentRef.setInput('day', createCalendarDay());
    fixture.detectChanges();

    expect(fixture.componentInstance.tooltipText()).toBe(
      'Рабочее время - 8 ч.<br>Работа ночью - 8 ч. план, 4 ч. факт',
    );
  });

  it('should sort work time before other day types in tooltip and dialog payload', () => {
    const workTime = createDayType({
      name: 'Рабочее время',
      hoursCountPlan: 8,
      hoursCountActual: 8,
    });
    const nightHours = createDayType({
      name: 'Ночные часы',
      hoursCountPlan: 8,
      hoursCountActual: 4,
      timeType: '',
    });
    const leaveWithoutPay = createDayType({
      name: 'Отпуск за свой счет',
      hoursCountPlan: 0,
      hoursCountActual: 0,
      timeType: '',
    });

    fixture.componentRef.setInput('row', {
      employeeDisplayName: 'Иванов И.И.',
      employee: {
        id: 'employee-1',
        name: 'Иванов Иван Иванович',
        position: 'Разработчик',
      },
      canOpenIssue: true,
      days: [
        {
          date: '2026-03-06',
          day: 5,
          dayTypes: [nightHours, leaveWithoutPay, workTime],
          variant: 'text',
          hasUnapprovedIssues: false,
          hours: 8,
          hoursFact: 4,
          iconKind: 'lucide',
          icon: null,
          color: null,
          bgColor: null,
        },
      ],
      summaryHours: 8,
      summaryHoursFact: 4,
    });
    fixture.componentRef.setInput('day', createCalendarDay());
    fixture.detectChanges();

    expect(fixture.componentInstance.tooltipText()).toBe(
      'Рабочее время - 8 ч.<br>Ночные часы - 8 ч. план, 4 ч. факт<br>Отпуск за свой счет',
    );

    const cell = fixture.nativeElement.querySelector(
      '.timesheet-cell',
    ) as HTMLDivElement;

    cell.click();

    expect(dialogServiceMock.open).toHaveBeenCalledWith(
      TimesheetDayDetailsDialogComponent,
      expect.objectContaining({
        data: expect.objectContaining({
          dayTypes: [workTime, nightHours, leaveWithoutPay],
        }),
      }),
    );
  });
});

function createCalendarDay(): CalendarGraphMonthDay {
  return {
    day: 0,
    name: '01',
    weekDay: 'Пн',
    isWeekend: false,
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
