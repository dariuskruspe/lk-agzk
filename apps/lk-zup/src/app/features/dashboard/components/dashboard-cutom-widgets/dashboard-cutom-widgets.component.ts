import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  signal,
  SimpleChanges,
  WritableSignal,
} from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { LangFacade } from '../../../../shared/features/lang/facades/lang.facade';
import { LangUtils } from '../../../../shared/features/lang/utils/lang.utils';
import { SettingsFacade } from '../../../../shared/features/settings/facades/settings.facade';
import { toUnzonedDate } from '../../../../shared/utilits/to-unzoned-date.util';
import { DashboardCustomWidgetsInterface } from '../../models/dashboard-custom-widgets.interfac';
import { SupportHelpMainInterface } from '@app/features/support/models/support-help.interface';

@Component({
  selector: 'app-dashboard-cutom-widgets',
  templateUrl: './dashboard-cutom-widgets.component.html',
  styleUrls: ['./dashboard-cutom-widgets.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class DashboardCustomWidgetsComponent implements OnChanges {
  @Input() widgets: DashboardCustomWidgetsInterface[];

  @Input() loading: boolean;

  @Output() openCustomWidgetDialog = new EventEmitter<{
    date: string;
    id: string;
    content: SupportHelpMainInterface;
    hidePeriodSelection: boolean;
    template?: string;
  }>();

  selectedDate = [];

  years = [];

  selectedId: WritableSignal<string> = signal('');

  constructor(
    public langUtils: LangUtils,
    public langFacade: LangFacade,
    public settingsFacade: SettingsFacade,
    public config: PrimeNGConfig,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes.widgets &&
      changes.widgets.currentValue &&
      changes.widgets.currentValue.length > 0
    ) {
      this.setStartDates();
    }
  }

  createReport(widgetIndex: number): void {
    this.selectedId.set(this.widgets[widgetIndex].id);
    const widget = this.widgets[widgetIndex];
    let dates: { dateBegin: Date | string; dateEnd: Date | string };
    if (widget.periodType !== 'custom') {
      if (widget.periodType !== 'year') {
        dates = this.createDates(
          this.widgets[widgetIndex].periodType,
          this.selectedDate[widgetIndex],
        );
      } else {
        dates = this.createDates(
          this.widgets[widgetIndex].periodType,
          this.years[widgetIndex],
        );
      }
    } else {
      dates = this.selectedDate[widgetIndex];
    }
    if (widget.hidePeriodSelection) {
      dates.dateBegin = widget.dateBegin;
      dates.dateEnd = widget.dateEnd;
    }
    this.openCustomWidgetDialog.emit({
      id: widget.id,
      date: toUnzonedDate(dates.dateBegin).toISOString(),
      content: {
        markup: widget.markup,
        title: widget.title,
      },
      hidePeriodSelection: widget.hidePeriodSelection,
      template: widget.template,
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
    this.widgets.forEach((widget, index) => {
      switch (widget.periodType) {
        case 'year':
          this.years[index] = new Date();
          break;
        case 'day':
          this.selectedDate[index] = new Date();
          break;
        case 'month':
          if (new Date(widget.dateEnd) > new Date()) {
            this.selectedDate[index] = new Date();
          } else {
            this.selectedDate[index] = new Date(widget.dateEnd);
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
