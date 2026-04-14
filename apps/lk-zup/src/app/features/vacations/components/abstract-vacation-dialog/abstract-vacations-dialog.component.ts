import { Component, OnInit } from '@angular/core';
import {
  FpcInputsInterface,
  FpcInterface,
} from '@wafpc/base/models/fpc.interface';
import moment from 'moment';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BehaviorSubject, Subject } from 'rxjs';
import { DateClass } from '../../../../shared/features/calendar-graph/classes/date.class';
import { WorkStatusInterface } from '../../../../shared/features/calendar-graph/models/calendar-graph-member-list.interface';
import { TranslatePipe } from '../../../../shared/features/lang/pipes/lang.pipe';
import { MessageSnackbarService } from '../../../../shared/features/message-snackbar/message-snackbar.service';
import { MessageType } from '../../../../shared/features/message-snackbar/models/message-type.enum';
import { definePluralForm } from '../../../../shared/utilits/pluralize.util';
import { MainCurrentUserInterface } from '../../../main/models/main-current-user.interface';
import { VacationActionEnum } from '../../models/vacations-approval.interface';
import { VacationsGraphDayOffListInterface } from '../../models/vacations-graph-day-off-list.interface';
import {
  VacationsStateInterface,
  VacationsStatesInterface,
} from '../../models/vacations-states.interface';
import { VacationTypeInterface } from '../../models/vacations-types.interface';
import {
  AvailableDaysReponseInterface,
  VacationPeriodInterface,
  VacationsInterface,
} from '../../models/vacations.interface';

@Component({
    template: '',
    standalone: false
})
export class AbstractVacationsDialogComponent implements OnInit {
  readonly data: {
    type: 'edit' | 'approve';
    vacation: VacationsInterface;
    statuses: WorkStatusInterface[];
    types: VacationTypeInterface[];
    states: VacationsStatesInterface;
    availableDays: AvailableDaysReponseInterface;
    daysOff: VacationsGraphDayOffListInterface;
    user: MainCurrentUserInterface;
    lang: 'ru' | 'en';
    year: number;
  };

  readonly vacationActionEnum = VacationActionEnum;

  readonly isManager: boolean;

  readonly isSubordinated: boolean;

  readonly isApprovingAllowed: boolean;

  readonly isApproval: boolean;

  daysOff: VacationsGraphDayOffListInterface;

  forms: { [type: string]: BehaviorSubject<FpcInterface> } = {};

  readonly lang: 'ru' | 'en';

  comment = '';

  submit$ = new Subject<void>();

  invalid: { [type: string]: boolean } = {};

  formInvalid: { [type: string]: boolean } = {};

  periods: VacationPeriodInterface[];

  commonPeriod: VacationPeriodInterface;

  typesHaving14DaysPeriod: Set<string> = new Set();

  hasCrossingPeriods = false;

  state: VacationsStateInterface;

  protected formData: FpcInterface;

  protected formInputs: FpcInputsInterface[];

  protected changedPeriods: {
    [key: string]: {
      startDate: string;
      endDate: string;
      disabled: boolean | '';
    }[];
  } = {};

  constructor(
    public dialogRef: DynamicDialogRef,
    protected config: DynamicDialogConfig,
    protected dateClass: DateClass,
    protected translatePipe: TranslatePipe,
    protected snackbarService?: MessageSnackbarService
  ) {
    this.data = config.data;
    this.isApproval = this.data.type === 'approve';
    this.isManager = this.data.user.isManager;
    this.isSubordinated = !!this.data.vacation?.subordinated;
    this.isApprovingAllowed = !!this.data.vacation?.approvingAllowed;
    this.lang = this.data.lang;
    this.daysOff = this.data.daysOff;
    this.periods = [
      ...(this.data.vacation?.periods || []).filter(
        (period) =>
          !!this.data.statuses.find(
            (status) => status.id === period.typeId && status.plannedVacation
          )
      ),
    ];
    this.commonPeriod = this.periods.find((period) => !period.approved) ?? {
      ...this.periods[0],
    };
    this.state =
      this.data.states?.states?.find(
        (state) => state.id === this.commonPeriod?.stateId
      ) || this.data.states?.states?.find((state) => state.default);
    this.setMfpcConfig();
  }

  ngOnInit(): void {
    this.fillForm();
  }

  close(action?: VacationActionEnum): void {
    if (!action) {
      this.dialogRef.close();
      return;
    }
    this.submit$.next();

    const changedPeriods = this.typedToPeriods(this.changedPeriods);

    if (!this.invalidSum || changedPeriods.length === 0 || this.isApproval) {
      switch (action) {
        case VacationActionEnum.save:
          if (this.has14daysPeriod) {
            this.dialogRef.close({
              action,
              periods: changedPeriods.filter(
                (period) => period.disabled !== true
              ),
              year: this.data.year,
            });
          } else {
            this.snackbarService.show(
              this.translatePipe.transform('ERROR_VACATION_14_DAYS'),
              MessageType.error
            );
          }
          break;
        case VacationActionEnum.discard:
        case VacationActionEnum.approve:
          this.dialogRef.close({
            action,
            employees: [
              {
                employeeId: this.data.vacation.employeeId,
                comment: this.comment || null,
                periods: this.data.vacation.periods.filter(
                  (period) =>
                    !!this.data.statuses.find(
                      (status) => status.id === period.typeId && status.plannedVacation
                    )
                )
              },
            ],
            year: this.data.year,
          });
          break;
        default:
          this.dialogRef.close();
          break;
      }
    }
  }

  get invalidSum(): boolean {
    return (
      Object.keys(this.invalid).reduce((acc, typeId) => {
        const invalid = this.invalid[typeId];
        return acc || invalid;
      }, false) ||
      Object.keys(this.formInvalid).reduce((acc, typeId) => {
        const invalid = this.invalid[typeId];
        return acc || invalid;
      }, false) ||
      this.hasCrossingPeriods
    );
  }

  get has14daysPeriod(): boolean {
    return !!this.typesHaving14DaysPeriod.size;
  }

  protected setMfpcConfig(): void {
    this.formInputs = [
      {
        type: 'arr-smart',
        formControlName: 'vacations',
        label:
          this.lang === 'ru'
            ? 'Добавить период отпуска'
            : 'Add period of vacation',
        errorMessage:
          this.lang === 'ru' ? 'Поле не заполнено' : 'The field is not filled',
        disabled: this.isApproval || !this.isManager || !this.isPlanEnable,
        edited: true,
        arrSmartList: [
          {
            type: 'datepicker-range-start',
            formControlName: 'startDate',
            label:
              this.lang === 'ru'
                ? 'Начало отпуска'
                : 'I want to take a leave of absence with',
            gridClasses: ['col-md-6'],
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            validations: ['required'],
            errorMessage:
              this.lang === 'ru'
                ? 'Поле не заполнено'
                : 'The field is not filled',
            disabled: this.isApproval,
            edited: true,
            mask: this.lang === 'ru' ? '11.22.3333' : '22/11/3333',
            endDateControl: 'endDate',
            startDateMathDay: this.diffToRequiredYear().start,
            endDateMathDay: this.diffToRequiredYear().end,
            dateHighlightType: 'schedule',
          },
          {
            type: 'datepicker-range-end',
            formControlName: 'endDate',
            label: this.lang === 'ru' ? 'Конец отпуска' : 'Last day of leave',
            gridClasses: ['col-md-6'],
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            validations: ['required'],
            errorMessage:
              this.lang === 'ru'
                ? 'Поле не заполнено'
                : 'The field is not filled',
            disabled: this.isApproval,
            edited: true,
            mask: this.lang === 'ru' ? '11.22.3333' : '22/11/3333',
            startDateControl: 'startDate',
            startDateMathDay: this.diffToRequiredYear().start,
            endDateMathDay: this.diffToRequiredYear().end,
            dateHighlightType: 'schedule',
          },
          {
            type: 'checkbox',
            formControlName: 'disabled',
            gridClasses: ['d-none', 'invisible'],
          },
          {
            type: 'static',
            gridClasses: ['col-md-12'],
            formControlName: 'chosenDates',
          },
        ],
      },
    ];
    this.formData = {
      options: {
        changeStrategy: 'push',
        appearanceElements: 'outline',
        editMode: !this.isApproval,
        viewMode:
          !this.isPlanEnable ||
          this.commonPeriod?.activeApprovement ||
          this.isApproval
            ? 'show'
            : 'edit',
      },
      template: this.formInputs,
      data: {},
    };
  }

  protected get isPlanEnable(): boolean {
    return (
      this.data.availableDays.planEnable &&
      !!this.data.availableDays.vacationTypes.find(
        (type) => type.daysPossible > 0
      )
    );
  }

  protected fillForm(): void {
    throw new Error('Please rewrite method "fillForm" to fill form with data');
  }

  protected toISOstring(date: moment.Moment | string | Date): string {
    if (date?.toString() === 'Invalid Date') {
      return '';
    }
    if (typeof date === 'string') {
      return date;
    }
    return date?.toISOString() ?? '';
  }

  protected separateDates(
    dateStart: string,
    dateEnd: string,
    daysOff: VacationsGraphDayOffListInterface
  ): {
    holiday: number;
    dayOff: number;
    workDay: number;
    total: number;
  } {
    return this.dateClass.separateDateTypes(dateStart, dateEnd, daysOff);
  }

  protected getStaticText(days: {
    holiday: number;
    dayOff: number;
    workDay: number;
    total: number;
  }): string {
    return `${days.total} ${this.translatePipe.transform(
      definePluralForm(
        days.total,
        ['ONE_DAY', 'TWO_DAYS', 'PLURAL_DAYS'],
        this.lang
      ) as string
    )} (${days.workDay} ${this.translatePipe.transform(
      definePluralForm(
        days.workDay,
        ['ONE_WORKDAY', 'TWO_WORKDAYS', 'PLURAL_WORKDAYS'],
        this.lang
      ) as string
    )}, ${days.dayOff} ${this.translatePipe.transform(
      definePluralForm(
        days.dayOff,
        ['ONE_DAYOFF', 'TWO_DAYSOFF', 'PLURAL_DAYSOFF'],
        this.lang
      ) as string
    )}, ${days.holiday} ${this.translatePipe.transform(
      definePluralForm(
        days.holiday,
        ['ONE_HOLIDAY', 'TWO_HOLIDAY', 'PLURAL_HOLIDAY'],
        this.lang
      ) as string
    )})`;
  }

  protected periodsToTyped(periods: VacationPeriodInterface[]): {
    [type: string]: {
      startDate: string;
      endDate: string;
      disabled: boolean | '';
    }[];
  } {
    return periods.reduce((acc, period) => {
      acc[period.vacationTypeId] = [
        ...(acc[period.vacationTypeId] || []),
        period,
      ];
      return acc;
    }, {});
  }

  protected typedToPeriods(typed: {
    [type: string]: {
      startDate: string;
      endDate: string;
      disabled: boolean | '';
    }[];
  }): VacationPeriodInterface[] {
    let periods = [];
    Object.keys(typed).forEach((typeId) => {
      periods = [
        ...periods,
        ...typed[typeId].map((i) => ({ ...i, vacationTypeId: typeId })),
      ];
    });
    return periods;
  }

  protected diffToRequiredYear(): { start: number; end: number } {
    const required = new Date(Date.UTC(this.data.year, 0)).toISOString();
    let next: Date | string = new Date(Date.UTC(this.data.year + 1, 0));
    next.setDate(next.getDate() - 1);
    next = next.toISOString();
    const current = new Date();
    return {
      start:
        this.dateClass.getDateDiff(
          new Date(
            Date.UTC(
              current.getFullYear(),
              current.getMonth(),
              current.getDate()
            )
          ).toISOString(),
          required
        ) - 1,
      end: this.dateClass.getDateDiff(
        new Date(
          Date.UTC(current.getFullYear(), current.getMonth(), current.getDate() + 1)
        ).toISOString(),
        next
      ),
    };
  }

  protected isPeriodDisabled(period: {
    startDate: string;
    endDate: string;
    disabled?: boolean | '';
    typeId?: string;
    approved?: boolean | '';
  }): boolean {
    const startDate = new Date(period.startDate);
    return (
      !!period.disabled ||
      (startDate?.getDate() === 1 &&
        startDate?.getMonth() === 0 &&
        !!period.approved) ||
      !!this.data.statuses.find(
        (status) => status.id === period.typeId && !status.plannedVacation
      ) ||
      !!period.approved
    );
  }
}
