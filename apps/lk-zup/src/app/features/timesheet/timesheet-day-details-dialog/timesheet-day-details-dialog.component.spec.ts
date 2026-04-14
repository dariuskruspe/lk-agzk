import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LangFacade } from '@app/shared/features/lang/facades/lang.facade';
import { TranslatePipe } from '@app/shared/features/lang/pipes/lang.pipe';
import { AppService } from '@app/shared/services/app.service';
import { SharedStateService } from '@app/shared/states/shared-state.service';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { TimesheetScheduleDayType } from '@app/shared/features/timesheet-schedule';
import { TimesheetDayDetailsDialogData } from './timesheet-day-details-dialog.interface';
import { TimesheetDayDetailsDialogComponent } from './timesheet-day-details-dialog.component';

jest.mock(
  '@app/features/issues/containers/issues-show-container/issues-show-container.component',
  () => ({
    IssuesShowContainerComponent: class IssuesShowContainerComponent {},
  }),
);

import { IssuesShowContainerComponent } from '@app/features/issues/containers/issues-show-container/issues-show-container.component';

describe('TimesheetDayDetailsDialogComponent', () => {
  const dialogServiceMock = {
    open: jest.fn(() => ({})),
  };

  const dialogRefMock = {
    close: jest.fn(),
  };

  const appServiceMock = {
    languageCodes: ['ru', 'en'],
  };

  const langFacadeMock = {
    getLang: jest.fn(() => 'ru'),
  };

  const sharedStateMock = {
    issueStatusMap: signal({
      'state-1': {
        id: 'state-1',
        name: 'На согласовании',
        color: '#E4EDFD',
        code: 1,
        searchTarget: [],
        cancelAccess: false,
        icon: '',
        description: 'Описание статуса',
      },
      'state-2': {
        id: 'state-2',
        name: 'Согласовано',
        color: '#FCEFD5',
        code: 2,
        searchTarget: [],
        cancelAccess: false,
        icon: '',
        description: 'Описание статуса 2',
      },
    }),
  };

  afterEach(() => {
    jest.clearAllMocks();
    TestBed.resetTestingModule();
  });

  it('should render work time before other day types and show request number title', async () => {
    const fixture = await createComponent({
      employeeName: 'Иванов И.И.',
      date: '2026-02-03',
      hoursPlan: 8,
      hoursFact: 6,
      dayTypes: [
        createDayType({
          name: 'Командировка',
          issueId: 'issue-1',
          stateId: 'state-1',
          code: '123',
          timeType: 'Командировка',
          calendarType: 'fact',
        }),
        createDayType({
          name: 'Рабочий день',
          issueId: '',
          timeType: 'Рабочий день',
          calendarType: 'plan',
        }),
      ],
    });

    const titles = Array.from(
      fixture.nativeElement.querySelectorAll(
        '.timesheet-day-details__item-title',
      ),
    ).map((node) => (node as HTMLElement).textContent?.trim());

    expect(titles).toEqual(['Рабочий день', 'Заявка №123']);
    expect(
      fixture.nativeElement.querySelector(
        '.timesheet-day-details__item-subtitle',
      )?.textContent?.trim(),
    ).toBe('Командировка');
    expect(
      fixture.nativeElement.querySelectorAll(
        '.timesheet-day-details__issue-link',
      ),
    ).toHaveLength(1);
    expect(fixture.nativeElement.textContent.includes('Открыть заявку')).toBe(
      true,
    );
  });

  it('should hide issue link when day has no linked issues', async () => {
    const fixture = await createComponent({
      employeeName: 'Иванов И.И.',
      date: '2026-02-03',
      hoursPlan: 8,
      hoursFact: 8,
      dayTypes: [
        createDayType({
          name: 'Рабочий день',
          issueId: '',
        }),
      ],
    });

    expect(
      fixture.nativeElement.querySelector('.timesheet-day-details__issue-link'),
    ).toBeNull();
  });

  it('should hide issue links for colleague day even with linked issue', async () => {
    const fixture = await createComponent({
      employeeName: 'Петров П.П.',
      date: '2026-02-03',
      hoursPlan: 8,
      hoursFact: 6,
      canOpenIssue: false,
      dayTypes: [
        createDayType({
          name: 'Командировка',
          issueId: 'issue-1',
          stateId: 'state-1',
          timeType: 'Командировка',
        }),
      ],
    });

    expect(
      fixture.nativeElement.querySelector('.timesheet-day-details__issue-link'),
    ).toBeNull();
  });

  it('should hide plan and difference for non-working day types', async () => {
    const fixture = await createComponent({
      employeeName: 'Иванов И.И.',
      date: '2026-02-03',
      hoursPlan: 8,
      hoursFact: 8,
      dayTypes: [
        createDayType({
          name: 'Отпуск',
          timeType: 'Отпуск',
        }),
      ],
    });

    const dayTypeItem = fixture.nativeElement.querySelector(
      '.timesheet-day-details__item',
    ) as HTMLElement;

    const statLabels = Array.from(
      dayTypeItem.querySelectorAll('.timesheet-day-details__stat dt'),
    ).map((node) => (node as HTMLElement).textContent?.trim());

    expect(statLabels).toEqual(['Факт']);
    expect(statLabels).not.toContain('План');
    expect(statLabels).not.toContain('Отклонение');
  });

  it('should use generated light background for valid hex day type color', async () => {
    const fixture = await createComponent({
      employeeName: 'Иванов И.И.',
      date: '2026-02-03',
      hoursPlan: 8,
      hoursFact: 8,
      dayTypes: [
        createDayType({
          name: 'Кастомный тип дня',
          color: '#F7A',
          timeType: '',
        }),
      ],
    });

    const marker = fixture.nativeElement.querySelector(
      '.timesheet-day-details__marker',
    ) as HTMLDivElement;

    expect(
      marker.style.getPropertyValue('--marker-color').trim().toUpperCase(),
    ).toBe('#FF77AA');
    expect(
      marker.style.getPropertyValue('--marker-bg').trim().toUpperCase(),
    ).toBe('#FFE1EC');
  });

  it('should render resolved status for linked issue', async () => {
    const fixture = await createComponent({
      employeeName: 'Иванов И.И.',
      date: '2026-02-03',
      hoursPlan: 8,
      hoursFact: 6,
      dayTypes: [
        createDayType({
          name: 'Командировка',
          issueId: 'issue-1',
          stateId: 'state-1',
          timeType: 'Командировка',
        }),
      ],
    });

    const statusBadge = fixture.nativeElement.querySelector(
      '.timesheet-day-details__badge--status',
    ) as HTMLElement;
    const title = fixture.nativeElement.querySelector(
      '.timesheet-day-details__item-title',
    ) as HTMLElement;
    const badges = fixture.nativeElement.querySelectorAll(
      '.timesheet-day-details__badge',
    );

    expect(title.textContent?.trim()).toBe('Заявка №456');
    expect(statusBadge.textContent?.trim()).toBe('На согласовании');
    expect(statusBadge.style.background).toContain('228, 237, 253');
    expect(badges).toHaveLength(1);
    expect(
      fixture.nativeElement.querySelector('.timesheet-day-details__stats'),
    ).toBeNull();
  });

  it('should not render status badge when state is unknown', async () => {
    const fixture = await createComponent({
      employeeName: 'Иванов И.И.',
      date: '2026-02-03',
      hoursPlan: 8,
      hoursFact: 6,
      dayTypes: [
        createDayType({
          name: 'Командировка',
          issueId: 'issue-1',
          stateId: 'missing-state',
          timeType: 'Командировка',
        }),
      ],
    });

    expect(
      fixture.nativeElement.querySelector(
        '.timesheet-day-details__badge--status',
      ),
    ).toBeNull();
  });

  it('should open clicked linked issue without closing current dialog', async () => {
    const fixture = await createComponent({
      employeeName: 'Иванов И.И.',
      date: '2026-02-03',
      hoursPlan: 8,
      hoursFact: 6,
      dayTypes: [
        createDayType({
          name: 'Командировка',
          issueId: 'issue-1',
          stateId: 'state-1',
          code: '456',
          timeType: 'Командировка',
        }),
        createDayType({
          name: 'Отпуск',
          issueId: 'issue-2',
          stateId: 'state-2',
          timeType: 'Отпуск',
        }),
      ],
    });

    const button = fixture.nativeElement.querySelectorAll(
      '.timesheet-day-details__issue-link',
    )[1] as HTMLButtonElement;

    button.click();
    await fixture.whenStable();

    expect(dialogServiceMock.open).toHaveBeenCalledWith(
      IssuesShowContainerComponent,
      {
        width: '1065px',
        data: {
          issueId: 'issue-2',
          syncTabWithQueryParams: false,
        },
        closable: true,
        dismissableMask: true,
      },
    );
    expect(dialogRefMock.close).not.toHaveBeenCalled();
  });

  it('should not render shared footer action anymore', async () => {
    const fixture = await createComponent({
      employeeName: 'Иванов И.И.',
      date: '2026-02-03',
      hoursPlan: 8,
      hoursFact: 6,
      dayTypes: [
        createDayType({
          name: 'Командировка',
          issueId: 'issue-1',
          stateId: 'state-1',
          timeType: 'Командировка',
        }),
      ],
    });

    expect(
      fixture.nativeElement.querySelector('.timesheet-day-details__footer'),
    ).toBeNull();
  });

  async function createComponent(
    data: TimesheetDayDetailsDialogData,
  ): Promise<ComponentFixture<TimesheetDayDetailsDialogComponent>> {
    await TestBed.configureTestingModule({
      imports: [TimesheetDayDetailsDialogComponent],
      providers: [
        TranslatePipe,
        { provide: DialogService, useValue: dialogServiceMock },
        { provide: DynamicDialogConfig, useValue: { data } },
        { provide: DynamicDialogRef, useValue: dialogRefMock },
        { provide: AppService, useValue: appServiceMock },
        { provide: LangFacade, useValue: langFacadeMock },
        { provide: SharedStateService, useValue: sharedStateMock },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(TimesheetDayDetailsDialogComponent);
    fixture.detectChanges();
    return fixture;
  }
});

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
