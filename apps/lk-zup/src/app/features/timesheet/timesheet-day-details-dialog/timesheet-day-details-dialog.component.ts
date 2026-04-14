import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { AppIconComponent } from '@app/shared/components/app-icon/app-icon.component';
import { LangModule } from '@app/shared/features/lang/lang.module';
import { TranslatePipe } from '@app/shared/features/lang/pipes/lang.pipe';
import { IssuesStatusListInterface } from '@features/issues/models/issues.interface';
import {
  TimesheetDayStyle,
  TimesheetMapper,
  TimesheetScheduleDayType,
} from '@app/shared/features/timesheet-schedule';
import { SharedStateService } from '@app/shared/states/shared-state.service';
import { DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { sortTimesheetDayTypes } from '../day-type-sort';
import { TimesheetDayDetailsDialogData } from './timesheet-day-details-dialog.interface';

type TimesheetDayDetailsItemVm = {
  dayType: TimesheetScheduleDayType;
  style: TimesheetDayStyle;
  title: string;
  subtitle: string | null;
  calendarTypeLabelKey: 'STATUS_FACT' | 'TIMESHEET_DAY_DETAILS_PLAN';
  showCalendarTypeBadge: boolean;
  showStats: boolean;
  showPlanAndDifference: boolean;
  issueId: string;
  resolvedState: IssuesStatusListInterface | null;
  canOpenIssue: boolean;
};

const DAY_TYPES_WITH_PLAN_AND_DIFFERENCE = new Set<
  TimesheetScheduleDayType['timeType']
>(['Рабочий день', 'Выходной день']);

@Component({
  selector: 'app-timesheet-day-details-dialog',
  imports: [CommonModule, LangModule, AppIconComponent],
  templateUrl: './timesheet-day-details-dialog.component.html',
  styleUrl: './timesheet-day-details-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimesheetDayDetailsDialogComponent {
  private timesheetMapper = inject(TimesheetMapper);
  private translatePipe = inject(TranslatePipe);
  private dialogService = inject(DialogService);
  private sharedState = inject(SharedStateService);

  config =
    inject<DynamicDialogConfig<TimesheetDayDetailsDialogData>>(
      DynamicDialogConfig,
    );

  data = computed(() => this.config.data);

  dayTypeItems = computed<TimesheetDayDetailsItemVm[]>(() => {
    const issueStatusMap: Record<string, IssuesStatusListInterface | undefined> =
      this.sharedState.issueStatusMap() ?? {};
    const canOpenIssue = this.data()?.canOpenIssue ?? true;

    return sortTimesheetDayTypes(this.data()?.dayTypes ?? []).map((dayType) => ({
      dayType,
      style: this.timesheetMapper.mapDayStyles(dayType),
      title: dayType.code ? `Заявка №${dayType.code}` : dayType.name,
      subtitle: dayType.code ? dayType.name : null,
      calendarTypeLabelKey:
        dayType.calendarType === 'fact'
          ? 'STATUS_FACT'
          : 'TIMESHEET_DAY_DETAILS_PLAN',
      showCalendarTypeBadge: !dayType.issueId,
      showStats: !dayType.issueId,
      showPlanAndDifference: DAY_TYPES_WITH_PLAN_AND_DIFFERENCE.has(
        dayType.timeType,
      ),
      issueId: dayType.issueId,
      resolvedState: dayType.stateId ? issueStatusMap[dayType.stateId] : null,
      canOpenIssue: canOpenIssue && Boolean(dayType.issueId),
    }));
  });

  hoursDifference = computed(() => {
    const hoursPlan = this.data()?.hoursPlan;
    const hoursFact = this.data()?.hoursFact;

    if (hoursPlan == null || hoursFact == null) {
      return null;
    }

    return hoursFact - hoursPlan;
  });

  constructor() {
    this.config.header = this.translatePipe.transform(
      'TIMESHEET_DAY_DETAILS_TITLE',
    );
  }

  formatNumber(value: number | null | undefined): string {
    if (value == null) {
      return '—';
    }

    return `${value} ч.`;
  }

  formatDifference(value: number | null | undefined): string {
    if (value == null) {
      return '—';
    }

    if (value > 0) {
      return `+${value} ч.`;
    }

    return `${value} ч.`;
  }

  getDifferenceState(
    value: number | null | undefined,
  ): 'positive' | 'negative' | 'neutral' | 'empty' {
    if (value == null) {
      return 'empty';
    }

    if (value > 0) {
      return 'positive';
    }

    if (value < 0) {
      return 'negative';
    }

    return 'neutral';
  }

  async openIssue(issueId: string): Promise<void> {
    if (!issueId) {
      return;
    }

    const { IssuesShowContainerComponent } =
      await import('@app/features/issues/containers/issues-show-container/issues-show-container.component');

    this.dialogService.open(IssuesShowContainerComponent, {
      width: '1065px',
      data: { issueId, syncTabWithQueryParams: false },
      closable: true,
      dismissableMask: true,
    });
  }
}
