import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
} from '@angular/forms';
import { DateClass } from '@shared/features/calendar-graph/classes/date.class';
import { OptionListFacade } from '@shared/features/option-list/facades/option-list.facade';
import { MathCurrentDateDayUtils } from '@shared/utilits/math-current-date-day.utils';
import { toUnzonedDate } from '@shared/utilits/to-unzoned-date.util';
import { isHoliday, isWeekend } from '@shared/utils/datetime/common';
import { dateMeta2Date } from '@shared/utils/datetime/primeng';
import { FpcInputsInterface } from '@wafpc/base/models/fpc.interface';
import { VacationsGraphDayOffListInterface } from '../../../../vacations/models/vacations-graph-day-off-list.interface';
import { IssuesAddInterface } from '../../../models/issues-add.interface';
import { IssuesTypesTemplateInterface } from '../../../models/issues-types.interface';
import { IBalanceByType } from '../../../models/issues.interface';
import { IssuesEmployeeNameUtils } from '../../../utils/issues-employee-name.utils';
import { AbstractCustomIssueComponent } from '../abstract-custom-issue/abstract-custom-issue.component';

@Component({
    selector: 'app-issues-add-unscheduled-vacation',
    templateUrl: './issues-add-unscheduled-vacation.component.html',
    styleUrls: ['./issues-add-unscheduled-vacation.component.scss'],
    standalone: false
})
export class IssuesAddUnscheduledVacationComponent
  extends AbstractCustomIssueComponent
  implements OnInit, OnChanges
{
  currentDay = new Date();

  @Input() issuesType: IssuesTypesTemplateInterface;

  @Input() loading: boolean;

  @Input() vacationBalance: {
    vacations: IBalanceByType[];
    vacationsTotal: number;
  };

  @Input() vacationBalanceByDate: {
    vacations: IBalanceByType[];
    vacationsTotal: number;
  };

  // @Input() vacationBalanceByEndDate: {
  //   vacations: IBalanceByType[];
  //   vacationsTotal: number;
  // };

  @Input() isMobile: boolean;

  @Input() daysOff: VacationsGraphDayOffListInterface;

  @Input() employeesApprovingPersons: string[];

  @Input() employeesStaticData: IssuesAddInterface;

  @Input() employeesAdditionalStaticData: Partial<IssuesAddInterface>;

  @Output() goBack = new EventEmitter();

  @Output() issueFormSubmit = new EventEmitter();

  @Output() changeDate = new EventEmitter<Date>();

  // @Output() changeEndDate = new EventEmitter<Date>();

  weekendCount: {
    work: number;
    weekend: number;
    vacationBalance: number;
    vacationBalanceEnd: number;
    holidays: number;
  }[] = [];

  index;

  indexOfEnd;

  vacationBalanceByDates: {
    vacations: IBalanceByType[];
    vacationsTotal: number;
  }[];

  isOpenMobileTooltip = false;

  minDateBegin;

  maxDateBegin;

  minDateEnd;

  maxDateEnd;

  employeeDataModded: {
    value: string;
    title: string;
  }[] = [];

  disableChangeModel = false;

  parentId: string;

  readonly createDateFormGroup = (
    validatorFns: {
      vacationTypeID?: ValidatorFn[];
      dateBegin?: ValidatorFn[];
      dateEnd?: ValidatorFn[];
    } = {}
  ): FormGroup<{
    vacationTypeID: FormControl<string | null>;
    dateBegin: FormControl<Date | null>;
    dateEnd: FormControl<Date | null>;
  }> => {
    return this.fb.group({
      vacationTypeID: new FormControl<string | null>(
        null,
        validatorFns.vacationTypeID ?? []
      ),
      dateBegin: new FormControl<Date | null>(
        null,
        validatorFns.dateBegin ?? []
      ),
      dateEnd: new FormControl<Date | null>(null, validatorFns.dateEnd ?? []),
    });
  };

  readonly form = this.fb.group({
    overtimeWork: this.fb.array<ReturnType<typeof this.createDateFormGroup>>(
      []
    ),
  });

  get controls(): ReturnType<typeof this.createDateFormGroup>[] {
    return this.form.controls.overtimeWork.controls;
  }

  private readonly validators: Record<string, ValidatorFn[]> = {};

  constructor(
    private ref: ChangeDetectorRef,
    public mathDayUtils: MathCurrentDateDayUtils,
    private dateClass: DateClass,
    protected fb: FormBuilder,
    public optionListFacade: OptionListFacade,
    private issuesEmployeeNameUtils: IssuesEmployeeNameUtils
  ) {
    super(fb, optionListFacade);
  }

  ngOnInit(): void {
    this.initForm();
    const data = localStorage.getItem('issue_data')
      ? JSON.parse(localStorage.getItem('issue_data'))
      : null;
    if (data) {
      this.parentId = data.parentId;
      for (let i = 0; i < data.overtimeWork.length; i += 1) {
        this.addRow();
      }
      data.overtimeWork.forEach((value, index) => {
        this.controls[index].setValue({
          vacationTypeID: value.vacationTypeID,
          dateBegin: new Date(value.dateBegin),
          dateEnd: new Date(value.dateEnd),
        });
      });
    }
  }

  initForm(): void {
    this.vacationBalanceByDates = new Array(10);
    window.addEventListener('click', () => {
      if (this.isMobile) {
        this.isOpenMobileTooltip = false;
        this.ref.detectChanges();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes.vacationBalanceByDate &&
      changes.vacationBalanceByDate.currentValue &&
      this.index !== undefined
    ) {
      this.vacationBalanceByDates[this.index] = this.vacationBalanceByDate;
      this.getRemainderStart(this.index);
      this.index = undefined;
    }

    // if (
    //   changes.vacationBalanceByEndDate &&
    //   changes.vacationBalanceByEndDate.currentValue &&
    //   this.indexOfEnd !== undefined
    // ) {
    //   this.getRemainderEnd(this.indexOfEnd);
    //   this.indexOfEnd = undefined;
    // }

    if (changes.issuesType && changes.issuesType.currentValue) {
      this.sourceFormData = {
        ...changes.issuesType.currentValue,
        template: changes.issuesType.currentValue.template.filter(
          (i: FpcInputsInterface) => i.formControlName !== 'overtimeWork'
        ),
      };
      this.sourceFormDataSubj.next(this.sourceFormData);

      this.doWithTemplate(
        this.issuesType.template,
        (item: FpcInputsInterface) => {
          if (item) {
            this.validators[item?.formControlName] =
              this.validatorUtils.getList(item, this.form);
          }
        }
      );
      if (this.form.controls.overtimeWork.length < 1) {
        this.addRow();
      }

      const startDateMathDayBegin =
        this.issuesType.template[0].arrSmartList.find((item) => {
          return item.formControlName === 'dateBegin';
        })?.startDateMathDay;
      if (startDateMathDayBegin) {
        this.minDateBegin = new Date(
          this.mathDayUtils.mathCurrentDateDay(
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            startDateMathDayBegin?.count || startDateMathDayBegin
          )
        );
      }

      const endDateMathDayBegin = this.issuesType.template[0].arrSmartList.find(
        (item) => {
          return item.formControlName === 'dateBegin';
        }
      )?.endDateMathDay;
      if (endDateMathDayBegin) {
        this.maxDateBegin = new Date(
          this.mathDayUtils.mathCurrentDateDay(
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            endDateMathDayBegin?.count || endDateMathDayBegin
          )
        );
      }

      const startDateMathDayEnd = this.issuesType.template[0].arrSmartList.find(
        (item) => {
          return item.formControlName === 'dateEnd';
        }
      )?.startDateMathDay;
      if (startDateMathDayEnd) {
        this.minDateEnd = new Date(
          this.mathDayUtils.mathCurrentDateDay(
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            startDateMathDayEnd?.count || startDateMathDayEnd
          )
        );
      }

      const endDateMathDayEnd = this.issuesType.template[0].arrSmartList.find(
        (item) => {
          return item.formControlName === 'dateEnd';
        }
      )?.endDateMathDay;
      if (endDateMathDayEnd) {
        this.maxDateEnd = new Date(
          this.mathDayUtils.mathCurrentDateDay(
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            endDateMathDayEnd?.count || endDateMathDayEnd
          )
        );
      }
    }
    if (
      (!changes?.loading && this.employeesStaticData && this.issuesType) ||
      (!changes?.loading && this.issuesType && this.employeesStaticData)
    ) {
      this.employeeDataModded = [];
      if (this.employeesAdditionalStaticData) {
        this.employeesStaticData = {
          ...this.employeesStaticData,
          ...this.employeesAdditionalStaticData,
        };
      }
      for (const name of this.issuesType?.options?.staticInfo || []) {
        if (
          this.employeesStaticData[name] &&
          this.employeesStaticData[name].value
        ) {
          this.employeeDataModded.push({
            value: this.issuesEmployeeNameUtils.getValue(
              name,
              this.employeesStaticData[name].value
            ),
            title: this.employeesStaticData[name].name,
          });
        }
      }
    }
  }

  onSubmit(): void {
    this.touchForm();
    this.markAsTouched(this.form);
    if (this.templatedForm.invalid || this.form.invalid) {
      return;
    }
    if (this.parentId) {
      this.issueFormSubmit.emit({
        ...this.templatedForm.value,
        parentId: this.parentId,
        overtimeWork: this.form.getRawValue().overtimeWork.map((item) => {
          return {
            ...item,
            dateBegin: toUnzonedDate(item.dateBegin).toISOString(),
            dateEnd: toUnzonedDate(item.dateEnd).toISOString(),
            vacationTypeID: item.vacationTypeID,
          };
        }),
      });
    } else {
      this.issueFormSubmit.emit({
        ...this.templatedForm.value,
        overtimeWork: this.form.getRawValue().overtimeWork.map((item) => {
          return {
            ...item,
            dateBegin: toUnzonedDate(item.dateBegin).toISOString(),
            dateEnd: toUnzonedDate(item.dateEnd).toISOString(),
            vacationTypeID: item.vacationTypeID,
          };
        }),
      });
    }
  }

  onBackPage(): void {
    this.goBack.emit();
  }

  addRow(): void {
    this.form.controls.overtimeWork.push(
      this.createDateFormGroup(this.validators)
    );
    this.weekendCount.push({
      work: 0,
      weekend: 0,
      vacationBalance: 0,
      vacationBalanceEnd: 0,
      holidays: 0,
    });
  }

  removeRow(index: number): void {
    this.form.controls.overtimeWork.removeAt(index);
    this.weekendCount.splice(index, 1);
    this.markAsTouched(this.form);
  }

  changeDateValue(date: Date, index: number): void {
    if (date) {
      this.index = index;
      this.changeDate.emit(date);
    }
  }

  changeEndDateValue(date: Date, index: number): void {
    if (date) {
      this.indexOfEnd = index;
      // this.changeEndDate.emit(date);
    }
  }

  getRemainderStart(index: number): void {
    const value = this.form.controls.overtimeWork.controls?.[index].value;
    if (
      index !== undefined &&
      value?.vacationTypeID &&
      value?.dateBegin &&
      this.vacationBalanceByDates[index]
    ) {
      const vacation = this.vacationBalanceByDates[index].vacations.find(
        (item) => item.vacationID === value?.vacationTypeID
      );
      this.weekendCount[index].vacationBalance = vacation.vacationBalance;
    }
  }

  // getRemainderEnd(index: number): void {
  //   const value = this.form.controls.overtimeWork.controls?.[index].value;
  //
  //   if (
  //     index !== undefined &&
  //     value?.vacationTypeID &&
  //     value?.dateBegin &&
  //     this.vacationBalanceByDates[index]
  //   ) {
  //     const vacation = this.vacationBalanceByEndDate.vacations.find(
  //       (item) => item.vacationID === value?.vacationTypeID
  //     );
  //     this.weekendCount[index].vacationBalanceEnd = vacation.vacationBalance;
  //   }
  // }

  changeWeekendCount(index: number): void {
    if (this.disableChangeModel) {
      this.disableChangeModel = false;
      return;
    }
    const value = this.form.controls.overtimeWork.controls?.[index].value;

    const start = value?.dateBegin
      ? toUnzonedDate(value?.dateBegin).toISOString()
      : null;
    const end = value?.dateEnd
      ? toUnzonedDate(value?.dateEnd).toISOString()
      : null;

    if (value?.dateBegin && value?.dateEnd && start > end) {
      this.disableChangeModel = true;
      this.form.controls.overtimeWork.controls?.[index].get('dateEnd').reset();
      return;
    }
    if (start && end) {
      const { holiday, dayOff, workDay } = this.dateClass.separateDateTypes(
        start,
        end,
        this.daysOff
      );
      this.weekendCount[index].weekend = dayOff;
      this.weekendCount[index].holidays = holiday;
      this.weekendCount[index].work = workDay;
    } else {
      this.weekendCount[index].weekend = 0;
      this.weekendCount[index].holidays = 0;
      this.weekendCount[index].work = 0;
    }
  }

  changeVacationType(index: number): void {
    this.getRemainderStart(index);
    // this.getRemainderEnd(index);
  }

  changeMobileTooltip(): void {
    this.isOpenMobileTooltip = !this.isOpenMobileTooltip;
  }

  isFormValid(): boolean {
    let res = !!this.form.getRawValue().overtimeWork.length;
    this.form.getRawValue().overtimeWork.forEach((vac) => {
      res = res && !!vac.vacationTypeID && !!vac.dateBegin && !!vac.dateEnd;
    });
    return res;
  }

  /* Utils */

  protected readonly isWeekend = isWeekend; // для использования в шаблоне (html-файле)

  protected readonly isHoliday = isHoliday; // для использования в шаблоне (html-файле)

  protected readonly dateMeta2Date = dateMeta2Date; // для использования в шаблоне (html-файле)
}
