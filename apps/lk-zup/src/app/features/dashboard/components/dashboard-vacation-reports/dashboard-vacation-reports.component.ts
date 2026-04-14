import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { LangFacade } from '../../../../shared/features/lang/facades/lang.facade';
import { LangUtils } from '../../../../shared/features/lang/utils/lang.utils';
import { SettingsFacade } from '../../../../shared/features/settings/facades/settings.facade';
import { SettingsInterface } from '../../../../shared/features/settings/models/settings.interface';
import { toUnzonedDate } from '../../../../shared/utilits/to-unzoned-date.util';
import { DashboardVacationReportsInterface } from '../../models/dashboard-vacation-reports.interface';

@Component({
    selector: 'app-dashboard-vacation-reports',
    templateUrl: './dashboard-vacation-reports.component.html',
    styleUrls: ['./dashboard-vacation-reports.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class DashboardVacationReportsComponent implements OnChanges {
  @Input() settings: SettingsInterface;

  @Input() reports: { reports: DashboardVacationReportsInterface[] };

  @Input() isEnabled: boolean | undefined;

  @Output() openVacationReportDialog = new EventEmitter<{
    dateBegin: string;
    dateEnd: string;
    reportId: string;
    formats: string[];
  }>();

  selectedDate = [];

  years = [];

  constructor(
    public langUtils: LangUtils,
    public langFacade: LangFacade,
    public settingsFacade: SettingsFacade,
    public config: PrimeNGConfig,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.reports && this.reports) {
      this.setStartDates();
    }
  }

  createReport(reportIndex: number): void {
    const report = this.reports.reports[reportIndex];
    let dates: { dateBegin: Date | string; dateEnd: Date | string };
    if (report.period !== 'custom') {
      if (report.period !== 'year') {
        dates = this.createDates(
          this.reports.reports[reportIndex].period,
          this.selectedDate[reportIndex],
        );
      } else {
        dates = this.createDates(
          this.reports.reports[reportIndex].period,
          this.years[reportIndex],
        );
      }
    } else {
      dates = this.selectedDate[reportIndex];
    }
    if (report.hidePeriodSelection) {
      dates.dateBegin = report.dateBegin;
      dates.dateEnd = report.dateEnd;
    }
    this.openVacationReportDialog.emit({
      reportId: report.reportId,
      dateBegin: toUnzonedDate(dates.dateBegin).toISOString(),
      dateEnd: toUnzonedDate(dates.dateEnd).toISOString(),
      formats: report.formats,
    });
  }

  createDates(
    type: 'day' | 'month' | 'year' | 'custom',
    selectedDate: Date | number,
  ): { dateBegin: Date; dateEnd: Date | undefined } {
    const dates = { dateBegin: new Date(), dateEnd: new Date() };
    switch (type) {
      case 'day':
        if (typeof selectedDate !== 'number') {
          dates.dateBegin = selectedDate;
          dates.dateEnd = undefined;
        }
        break;
      case 'month':
        if (typeof selectedDate !== 'number') {
          dates.dateBegin = new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            1,
          );
          dates.dateEnd = new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth() + 1,
            0,
          );
        }
        break;
      case 'year':
        dates.dateBegin = new Date(new Date(selectedDate).getFullYear(), 0, 1);
        dates.dateEnd = new Date(new Date(selectedDate).getFullYear(), 11, 31);
        break;
      default:
        break;
    }
    return dates;
  }

  setStartDates(): void {
    this.reports.reports.forEach((report, index) => {
      switch (report.period) {
        case 'year':
          this.years[index] = new Date();
          break;
        case 'day':
          this.selectedDate[index] = new Date();
          break;
        case 'month':
          if (new Date(report.dateEnd) > new Date()) {
            this.selectedDate[index] = new Date();
          } else {
            this.selectedDate[index] = new Date(report.dateEnd);
          }
          break;
        case 'custom':
          this.selectedDate[index] = {
            dateBegin: new Date(),
            dateEnd: new Date(),
          };
          break;
        default:
          break;
      }
    });
  }

  getDate(date: string | null): Date | null {
    if (date) {
      return new Date(date);
    }
    return null;
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
