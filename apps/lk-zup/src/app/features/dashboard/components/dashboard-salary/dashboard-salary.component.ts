import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  Renderer2,
  SimpleChanges,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DashboardPayslipInterface } from '@features/dashboard/models/dashboard-payslip.interface';
import { DashboardWorkPeriodsInterface } from '@features/dashboard/models/dashboard-work-periods.interface';
import { MainCurrentUserInterface } from '@features/main/models/main-current-user.interface';
import { SettingsInterface } from '@shared/features/settings/models/settings.interface';
import { AppService } from '@shared/services/app.service';
import { toUnzonedDate } from '@shared/utilits/to-unzoned-date.util';
import { EyeIcon } from 'lucide-angular';
import { EyeOffIcon } from 'lucide-angular';

@Component({
  selector: 'app-dashboard-salary',
  templateUrl: './dashboard-salary.component.html',
  styleUrls: ['./dashboard-salary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class DashboardSalaryComponent
  implements OnInit, OnChanges, AfterViewInit
{
  app: AppService = inject(AppService);

  salaryDateForm: FormGroup;

  textShow = false;

  workPeriodActive: string;

  workPeriodActiveValue: string;

  isShowSalary: boolean;

  @Input() dateLocale: string;

  @Input() payslip: DashboardPayslipInterface;

  @Input() workPeriods: DashboardWorkPeriodsInterface;

  @Input() currentUser: MainCurrentUserInterface;

  @Output() openSalaryImgDialog = new EventEmitter<string>();

  @Output() workPeriodDateUpdate = new EventEmitter();

  @Output() synonym = new EventEmitter<string>();

  @Input() isEnabled: boolean | undefined;

  @ViewChild('calendarRef') calendarRef: { inputfieldViewChild: ElementRef };

  settingsSignal: WritableSignal<SettingsInterface> =
    this.app.storage.settings.data.frontend.signal.globalSettings;

  EyeIcon = EyeIcon;
  EyeOffIcon = EyeOffIcon;

  constructor(
    private fb: FormBuilder,
    private renderer: Renderer2,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.workPeriods && changes.workPeriods.currentValue) {
      if (!this.salaryDateForm) this.initForm();
      const currentDate = toUnzonedDate(new Date());
      const lastAvailableDate = toUnzonedDate(
        this.workPeriods?.reports?.[0]?.dateEnd,
      );
      const chosen =
        lastAvailableDate && lastAvailableDate < currentDate
          ? this.getPreviousDay(lastAvailableDate)
          : currentDate;
      this.salaryDateForm.patchValue(
        {
          date: chosen,
        },
        { emitEvent: false },
      );
      this.onChangeForm(chosen);
    }
  }

  getPreviousDay(date: Date) {
    return new Date(
      Date.UTC(
        (date as Date).getFullYear(),
        (date as Date).getMonth(),
        (date as Date).getDate() - 1,
      ),
    );
  }

  ngAfterViewInit(): void {
    this.calendarRef?.inputfieldViewChild?.nativeElement.setAttribute(
      'data-date',
      this.workPeriodActiveValue || this.getUnzonedISODate(),
    );
  }

  ngOnInit(): void {
    if (!this.salaryDateForm) this.initForm();
  }

  initForm(): void {
    const unzonedDate = toUnzonedDate(new Date());

    this.salaryDateForm = this.fb.group({
      date: [unzonedDate],
    });
  }

  onChangeForm(date?: Date): void {
    if (date) {
      this.workPeriodActiveValue = date.toISOString();
    } else {
      this.workPeriodActiveValue = this.getUnzonedISODate();
    }

    this.calendarRef?.inputfieldViewChild?.nativeElement.setAttribute(
      'data-date',
      this.workPeriodActiveValue,
    );

    this.workPeriodDateUpdate.emit(this.workPeriodActiveValue);
  }

  toggleText(): void {
    this.textShow = !this.textShow;
  }

  onOpenSalaryImgDialog(): void {
    this.openSalaryImgDialog.emit(this.workPeriodActiveValue);
  }

  private getUnzonedISODate(): string {
    const date = new Date(this.salaryDateForm?.get('date')?.value);
    return new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
    ).toISOString();
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
