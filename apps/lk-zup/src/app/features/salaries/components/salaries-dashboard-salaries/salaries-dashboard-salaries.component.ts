import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  WritableSignal,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DashboardWorkPeriodsInterface } from '@features/dashboard/models/dashboard-work-periods.interface';
import { SalariesDashboardSalariesInterface } from '@features/salaries/models/salaries-dashboard-salaries.interface';
import {
  CALENDER_CONFIG_EN,
  CALENDER_CONFIG_RU,
} from '@shared/dictionaries/calendar-locale.dictionary';
import { AppService } from '@shared/services/app.service';
import { formatNumber } from '@shared/utils/number/common';
import { toUnzonedDate } from '@shared/utilits/to-unzoned-date.util';

@Component({
    selector: 'app-salaries-dashboard-salaries',
    templateUrl: './salaries-dashboard-salaries.component.html',
    styleUrls: ['./salaries-dashboard-salaries.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class SalariesDashboardSalariesComponent implements OnInit, OnChanges {
  app: AppService = inject(AppService);

  langTagSignal: WritableSignal<string> =
    this.app.storage.settings.data.frontend.signal.langTag;

  salaryDateForm: FormGroup;

  textShow = false;

  workPeriodActiveValue: string;

  @Input() dateLocale: string;

  @Input() loading: boolean;

  @Input() payslip: SalariesDashboardSalariesInterface;

  @Input() workPeriods: DashboardWorkPeriodsInterface;

  @Output() textDisplayChange = new EventEmitter();

  @Output() workPeriodDateUpdate = new EventEmitter();

  @Output() openSalaryImgDialog = new EventEmitter();

  readonly locale = {
    ru: CALENDER_CONFIG_RU,
    en: CALENDER_CONFIG_EN,
  };

  constructor(private fb: FormBuilder) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.workPeriods?.currentValue) {
      const date = new Date(
        changes.workPeriods.currentValue.reports[0]?.dateEnd,
      );
      this.salaryDateForm
        .get('date')
        .setValue(new Date(date.getFullYear(), date.getMonth(), 1));
      this.workPeriodActiveValue = this.getUnzonedISODate();
    }
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.salaryDateForm = this.fb.group({
      date: [new Date()],
    });
  }

  onChangeForm(): void {
    this.workPeriodActiveValue = this.getUnzonedISODate();
    this.workPeriodDateUpdate.emit(this.workPeriodActiveValue);
  }

  onTextDisplayChange(): void {
    this.textShow = !this.textShow;
    this.textDisplayChange.emit();
  }

  onOpenSalaryImgDialog(): void {
    this.openSalaryImgDialog.emit(this.workPeriodActiveValue);
  }

  toNumberFormat(num: number): string {
    return formatNumber(num, this.langTagSignal() || 'en-US');
  }

  toDate(value: string[] | string): (Date | null)[] | (Date | null) {
    // eslint-disable-next-line no-nested-ternary
    return Array.isArray(value)
      ? value.map((item) => (item ? new Date(item) : null))
      : value
        ? new Date(value)
        : null;
  }

  private getUnzonedISODate(): string {
    const date = new Date(this.salaryDateForm.get('date')?.value);
    return new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
    ).toISOString();
  }

  isWeekend(date: any): boolean {
    if (date) {
      const parsedDate = toUnzonedDate(
        new Date(date.year, date.month, date.day),
      );
      return parsedDate.getDay() === 0 || parsedDate.getDay() === 6;
    }
    return false;
  }
}
