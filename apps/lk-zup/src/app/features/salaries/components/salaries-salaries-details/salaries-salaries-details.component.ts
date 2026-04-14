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

@Component({
    selector: 'app-salaries-salaries-details',
    templateUrl: './salaries-salaries-details.component.html',
    styleUrls: ['./salaries-salaries-details.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class SalariesSalariesDetailsComponent implements OnInit, OnChanges {
  app: AppService = inject(AppService);

  langTagSignal: WritableSignal<string> =
    this.app.storage.settings.data.frontend.signal.langTag;

  salaryDateForm: FormGroup;

  textShow = false;

  workPeriodActiveValue: Date;

  @Input() dateLocale: string;

  @Input() initDate: string;

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
    if (changes?.workPeriods?.currentValue && this.initDate) {
      this.workPeriodActiveValue = new Date(
        this.initDate || changes.workPeriods.currentValue.reports[0].dateEnd
      );
      this.salaryDateForm.get('date').setValue(this.workPeriodActiveValue);
    }
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.salaryDateForm = this.fb.group({
      date: [new Date('')],
    });
  }

  onChangeForm(): void {
    const date = this.salaryDateForm.get('date')?.value;
    this.workPeriodDateUpdate.emit(
      new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
      ).toISOString()
    );
  }

  onWorkPeriodDateUpdate(date: Date): void {
    this.workPeriodActiveValue = date;
    this.workPeriodDateUpdate.emit(date.toISOString());
  }

  onTextDisplayChange(): void {
    this.textShow = !this.textShow;
    this.textDisplayChange.emit();
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
}
