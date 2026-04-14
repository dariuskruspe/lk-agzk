import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { CardModule } from 'primeng/card';
import { AppMonthSelectComponent } from '@app/shared/components/app-month-select/app-month-select.component';
import { DashboardV2Service } from '../../shared/dashboard.service';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  AppMonthPickerValue,
  AppMonthPicker,
} from '@app/shared/components/app-month-picker/app-month-picker';
import {
  ChevronDownIcon,
  DownloadIcon,
  EyeIcon,
  EyeOffIcon,
  LucideAngularModule,
} from 'lucide-angular';
import moment from 'moment';
import { autoaborted } from '@app/shared/utilits/autoaborted';
import { DashboardPayslipInterface } from '@app/features/dashboard/models/dashboard-payslip.interface';
import { GlobalSettingsStateService } from '@app/shared/states/global-settings-state.service';
import { LangModule } from '../../../../shared/features/lang/lang.module';
import { ReportDialogContainerComponent } from '@app/shared/features/report-dialog/containers/report-dialog-container/report-dialog-container.component';
import { DialogService } from 'primeng/dynamicdialog';
import { ReportDialogV2 } from '@app/shared/features/report-dialog-v2/report-dialog-v2/report-dialog-v2';
import { ReportDialogV2DialogConfig } from '@app/shared/features/report-dialog-v2/shared/types';
import { IWidgetComponent } from '../../shared/widget.interface';

@Component({
  selector: 'app-dashboard-v2-salary-widget',
  standalone: true,
  imports: [CardModule, AppMonthPicker, LucideAngularModule, LangModule],
  templateUrl: './dashboard-v2-salary-widget.component.html',
  styleUrl: './dashboard-v2-salary-widget.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardV2SalaryWidgetComponent implements IWidgetComponent {
  private dialogService = inject(DialogService);
  private dashboardService = inject(DashboardV2Service);

  private settings = inject(GlobalSettingsStateService).state;

  payrollType = computed(() => {
    return this.settings()?.dashboard?.payroll?.type;
  });

  workPeriods = toSignal(this.dashboardService.getWorkPeriods());

  payslipWorkPeriod = computed(() => {
    return this.workPeriods()?.reports?.[0] || null;
  });

  loadPayslipRequest = autoaborted();

  loading = toSignal(this.loadPayslipRequest.loading$);

  loading$ = this.loadPayslipRequest.loading$;

  selectedMonth = signal<AppMonthPickerValue | null>(null);

  isAmountVisible = signal(false);

  payslip = signal<DashboardPayslipInterface | null>(null);

  salaryAmount = computed(() => {
    const payslip = this.payslip();
    if (!payslip) return 0;
    return payslip.accrued;
  });

  minMonth = computed(() => {
    const payslip = this.payslipWorkPeriod();

    if (!payslip) return null;

    const d = moment(payslip.dateBegin);
    return [d.year(), d.month()] as AppMonthPickerValue;
  });

  maxMonth = computed(() => {
    const payslip = this.payslipWorkPeriod();

    if (!payslip) return null;

    const d = moment(payslip.dateEnd);
    return [d.year(), d.month()] as AppMonthPickerValue;
  });

  readonly ChevronDownIcon = ChevronDownIcon;
  readonly DownloadIcon = DownloadIcon;
  readonly EyeIcon = EyeIcon;
  readonly EyeOffIcon = EyeOffIcon;

  constructor() {
    effect(() => {
      const payslip = this.payslipWorkPeriod();
      if (payslip) {
        const d = moment(payslip.dateEnd);
        this.selectedMonth.set([d.year(), d.month()]);
      }
    });

    effect(() => {
      const selected = this.selectedMonth();
      if (!selected) return;

      this.loadPayslip(selected);
    });
  }

  loadPayslip(selectedMonth: AppMonthPickerValue | null) {
    this.loadPayslipRequest({
      obs: this.dashboardService.getPayslip(
        moment(selectedMonth).toISOString(),
      ),
      next: (payslip: DashboardPayslipInterface) => {
        this.payslip.set(payslip);
      },
    });
  }

  download() {
    this.dialogService.open(ReportDialogV2, {
      width: '1065px',
      data: {
        report: {
          dateBegin: moment(this.selectedMonth()).toISOString(),
          dateEnd: moment(this.selectedMonth()).endOf('month').toISOString(),
          reportId: 'payslip',
          formats: this.payslipWorkPeriod()?.formats,
        },
      } as ReportDialogV2DialogConfig,
      closable: true,
      dismissableMask: true,
    });
  }

  toggleVisibility() {
    this.isAmountVisible.set(!this.isAmountVisible());
  }
}

function createFacade() {}
