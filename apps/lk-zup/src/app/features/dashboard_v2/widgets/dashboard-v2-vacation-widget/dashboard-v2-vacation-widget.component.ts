import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { CardModule } from 'primeng/card';
import { AppDatePicker } from '@app/shared/components/app-date-picker/app-date-picker';
import { ChevronDownIcon, LucideAngularModule } from 'lucide-angular';
import moment from 'moment';
import { autoaborted } from '@app/shared/utilits/autoaborted';
import { DashboardApiService } from '../../shared/dashboard-api.service';
import { LocalStorageService } from '@app/shared/services/local-storage.service';
import { VacationAllInterface } from '@app/features/dashboard/models/dashboard-vacation.interface';
import { toUnzonedDate } from '@app/shared/utilits/to-unzoned-date.util';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@app/shared/features/lang/pipes/lang.pipe';
import { ReportDialogV2 } from '@app/shared/features/report-dialog-v2/report-dialog-v2/report-dialog-v2';
import { ReportDialogV2DialogConfig } from '@app/shared/features/report-dialog-v2/shared/types';
import { DialogService } from 'primeng/dynamicdialog';
import { IWidgetComponent } from '../../shared/widget.interface';

@Component({
  selector: 'app-dashboard-v2-vacation-widget',
  standalone: true,
  imports: [CardModule, AppDatePicker, LucideAngularModule],
  templateUrl: './dashboard-v2-vacation-widget.component.html',
  styleUrl: './dashboard-v2-vacation-widget.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardV2VacationWidgetComponent implements IWidgetComponent {
  private apiService = inject(DashboardApiService);
  private localStorageService = inject(LocalStorageService);
  private translatePipe = inject(TranslatePipe);
  private dialogService = inject(DialogService);

  selectedDate = signal<Date | null>(new Date());

  selectedPeriod = computed(() => {
    const date = this.selectedDate();
    if (!date) return '';
    return moment(date).format('DD.MM.YYYY');
  });

  readonly ChevronDownIcon = ChevronDownIcon;

  vacationBalance = signal<{
    vacationsTotal: number;
    vacations: VacationAllInterface[];
    header: string;
  } | null>(null);

  vacationDaysDisplay = computed(() => {
    const total = this.vacationBalance()?.vacationsTotal ?? 0;

    return this.translatePipe.daysLabel(total);
  });

  loadVacationBalanceRequest = autoaborted();

  loading = toSignal(this.loadVacationBalanceRequest.loading$);

  loading$ = this.loadVacationBalanceRequest.loading$;

  constructor() {
    effect(() => {
      const date = this.selectedDate();
      if (date) {
        this.loadVacationBalance(date);
      }
    });
  }

  loadVacationBalance(date: Date): void {
    const currentEmployeeId = this.localStorageService.getCurrentEmployeeId();
    if (!currentEmployeeId) {
      return;
    }

    const unzonedDate = toUnzonedDate(date);
    const isoDate = unzonedDate.toISOString();

    this.loadVacationBalanceRequest({
      obs: this.apiService.getVacationTotalDate({
        currentEmployeeId,
        date: isoDate,
      }),
      next: (balance) => {
        this.vacationBalance.set(balance);
      },
    });
  }

  download() {
    this.dialogService.open(ReportDialogV2, {
      width: '1065px',
      data: {
        report: {
          dateBegin: moment(this.selectedDate()).toISOString(),
          reportId: 'vacationBalance',
        },
      } as ReportDialogV2DialogConfig,
      closable: true,
      dismissableMask: true,
    });
  }
}
