import {
  TimesheetScheduleRow,
  TimesheetTimeType,
} from '../models/timesheet-schedule.interface';
import {
  TimesheetScheduleCalendarDay,
  TimesheetScheduleDayType,
} from '@app/shared/features/timesheet-schedule/models/timesheet-schedule.interface';
import moment from 'moment';
import {
  TimesheetCellVm,
  TimesheetDayStyle,
} from '../models/timesheet-vm.interface';
import {
  CalendarClockIcon,
  PlaneIcon,
  PlaneTakeoffIcon,
  StethoscopeIcon,
  ThermometerIcon,
  TreePalmIcon,
} from 'lucide-angular';
import { Injectable } from '@angular/core';

const HEX_COLOR_PATTERN = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
const LIGHT_BG_SOURCE_RATIO = 0.22;

const DAY_TYPE_STYLE_FALLBACK_MAP: Partial<
  Record<TimesheetTimeType, TimesheetDayStyle>
> = {
  Отпуск: {
    iconKind: 'lucide',
    icon: TreePalmIcon,
    color: '#3880FF',
    bgColor: '#EDF1FD',
  },
  Больничный: {
    iconKind: 'lucide',
    icon: ThermometerIcon,
    color: 'rgba(255, 119, 170, 1)',
    bgColor: 'rgba(255, 235, 243, 1)',
  },
  Командировка: {
    iconKind: 'lucide',
    icon: PlaneIcon,
    color: 'rgba(85, 182, 133, 1)',
  },
  'Работа в выходной': {
    iconKind: 'lucide',
    icon: CalendarClockIcon,
  },
};

@Injectable({
  providedIn: 'root',
})
export class TimesheetMapper {
  readonly mapDay = (day: TimesheetScheduleCalendarDay): TimesheetCellVm => {
    const types = day.dayType;

    const workTime = types.find(
      (d) => d.timeType === 'Рабочий день' && d.calendarType === 'fact',
    );

    const workInHoliday = types.find(
      (d) => d.timeType === 'Работа в выходной' && d.calendarType === 'fact',
    );

    const isVacation = types.some((d) => d.timeType === 'Отпуск');
    const isHoliday = types.some((d) => d.timeType === 'Выходной день');
    const isBusinessTrip = types.some((d) => d.timeType === 'Командировка');
    const isIllness = types.some((d) => d.timeType === 'Больничный');

    const primaryDayType = types.find(
      (d) => d.calendarType === 'fact' && d.timeType !== 'Рабочий день',
    );

    const common = {
      day: moment(day.date).day(),
      date: day.date,
      hours: day.hoursCountPlan,
      hoursFact: day.hoursCountActual,
      dayTypes: types,
      hasUnapprovedIssues: day.dayType.some((d) => d.issueId && d.onApproval),
    };

    // есть нет фактических часов и это отпуск/командировка/больничный
    if (!workTime && (isVacation || isIllness)) {
      return {
        ...common,
        ...this.mapDayStyles(primaryDayType),
        variant: 'big-icon',
      };
    }

    if (isBusinessTrip || isVacation || isIllness) {
      return {
        ...common,
        ...this.mapDayStyles(primaryDayType),
        variant: 'small-icon',
      };
    }

    if (isHoliday && workTime) {
      return {
        ...common,
        ...this.mapDayStyles(workTime),
        variant: 'text',
      };
    }
    if (workInHoliday) {
      return {
        ...common,
        ...this.mapDayStyles(workInHoliday),
        variant: 'small-icon',
      };
    }

    if (isHoliday) {
      return {
        ...common,
        color: null,
        bgColor: null,
        iconKind: 'lucide',
        icon: null,
        variant: 'dayoff',
      };
    }

    return {
      ...common,
      ...(primaryDayType ? this.mapDayStyles(primaryDayType) : {}),
      variant: 'text',
    };
  };

  readonly mapDayStyles = (dayType: TimesheetScheduleDayType) => {
    const fallbackStyle = DAY_TYPE_STYLE_FALLBACK_MAP[dayType?.timeType];
    const style = fallbackStyle
      ? { ...fallbackStyle }
      : {
          iconKind: 'lucide' as const,
          icon: null,
          color: null,
          bgColor: null,
        };

    if (dayType.iconName) {
      Object.assign(style, {
        iconKind: 'custom',
        icon: dayType.iconName,
      });
    }

    const normalizedColor = this.normalizeHexColor(dayType.color);

    if (normalizedColor) {
      Object.assign(style, {
        color: normalizedColor,
        bgColor: this.createLightBackgroundColor(normalizedColor),
      });
    }

    return style;
  };

  private normalizeHexColor(color: string | null | undefined): string | null {
    if (!color) {
      return null;
    }

    const trimmedColor = color.trim();

    if (!HEX_COLOR_PATTERN.test(trimmedColor)) {
      return null;
    }

    const hexValue = trimmedColor.slice(1);

    if (hexValue.length === 3) {
      const normalizedHex = hexValue
        .split('')
        .map((char) => `${char}${char}`)
        .join('');

      return `#${normalizedHex}`.toUpperCase();
    }

    return `#${hexValue}`.toUpperCase();
  }

  private createLightBackgroundColor(color: string): string {
    const [red, green, blue] = this.hexToRgb(color);

    return this.rgbToHex(
      this.mixWithWhite(red),
      this.mixWithWhite(green),
      this.mixWithWhite(blue),
    );
  }

  private hexToRgb(color: string): [number, number, number] {
    const normalizedColor = color.slice(1);

    return [
      parseInt(normalizedColor.slice(0, 2), 16),
      parseInt(normalizedColor.slice(2, 4), 16),
      parseInt(normalizedColor.slice(4, 6), 16),
    ];
  }

  private mixWithWhite(value: number): number {
    return Math.round(
      value * LIGHT_BG_SOURCE_RATIO + 255 * (1 - LIGHT_BG_SOURCE_RATIO),
    );
  }

  private rgbToHex(red: number, green: number, blue: number): string {
    return `#${[red, green, blue]
      .map((value) => value.toString(16).padStart(2, '0'))
      .join('')}`.toUpperCase();
  }
}
