import {
  VacationPeriodInterface,
  VacationsInterface,
} from '@app/features/vacations/models/vacations.interface';
import { VacationItemComputed } from './vacations.service';
import { inject, Injectable } from '@angular/core';
import { MemberPointTypeInterface } from './types';
import { UtilsService } from '@app/shared/services/utils.service';

@Injectable({
  providedIn: 'root',
})
export class VacationUtilsService {
  private utils = inject(UtilsService);

  computeOverlaps(vacations: VacationsInterface[]) {
    type Event = {
      date: Date;
      type: 'start' | 'end';
      vacation: VacationsInterface;
    };
    const events: Event[] = [];

    for (const vacation of vacations) {
      for (const p of vacation.periods) {
        events.push({
          date: new Date(p.startDate),
          type: 'start',
          vacation: vacation,
        });
        events.push({
          date: new Date(p.endDate),
          type: 'end',
          vacation: vacation,
        });
      }
    }

    // Сортируем события: сначала по дате, затем 'start' раньше 'end'
    events.sort(
      (a, b) =>
        a.date.getTime() - b.date.getTime() || (a.type === 'start' ? -1 : 1),
    );

    const active = new Set<string>();
    const overlaps: {
      startDate: Date;
      endDate: Date;
      employees: string[];
    }[] = [];
    let currentOverlapStart: Date | null = null;
    let currentEmployees: Set<string> = new Set();

    for (const e of events) {
      if (e.type === 'start') {
        active.add(e.vacation.employeeId);

        // Если началось пересечение (2+ сотрудника)
        if (active.size > 1) {
          // Если это новое пересечение или состав изменился
          if (
            !currentOverlapStart ||
            !this.areSetsEqual(currentEmployees, active)
          ) {
            // Закрываем предыдущее пересечение, если оно было
            if (currentOverlapStart && currentEmployees.size > 1) {
              overlaps.push({
                startDate: currentOverlapStart,
                endDate: new Date(e.date.getTime() - 1), // День до начала нового пересечения
                employees: [...currentEmployees],
              });
            }
            // Начинаем новое пересечение
            currentOverlapStart = e.date;
            currentEmployees = new Set(active);
          }
        }
      } else {
        // Перед удалением проверяем, было ли пересечение
        if (active.size > 1 && currentOverlapStart) {
          // Если состав меняется, закрываем текущее пересечение
          const newActive = new Set(active);
          newActive.delete(e.vacation.employeeId);

          overlaps.push({
            startDate: currentOverlapStart,
            endDate: e.date,
            employees: [...active],
          });

          // Если остается пересечение, начинаем новое
          if (newActive.size > 1) {
            currentOverlapStart = new Date(e.date.getTime() + 86400000); // Следующий день
            currentEmployees = new Set(newActive);
          } else {
            currentOverlapStart = null;
            currentEmployees = new Set();
          }
        }

        active.delete(e.vacation.employeeId);
      }
    }

    // Закрываем последнее пересечение, если оно осталось открытым
    if (currentOverlapStart && currentEmployees.size > 1) {
      // Находим максимальную дату окончания среди активных периодов
      const lastDate = events[events.length - 1]?.date || currentOverlapStart;
      overlaps.push({
        startDate: currentOverlapStart,
        endDate: lastDate,
        employees: [...currentEmployees],
      });
    }

    return overlaps;
  }

  private areSetsEqual(set1: Set<string>, set2: Set<string>): boolean {
    if (set1.size !== set2.size) return false;
    for (const item of set1) {
      if (!set2.has(item)) return false;
    }
    return true;
  }

  getPeriodColor(
    statusTypesMap: Record<string, MemberPointTypeInterface>,
    period: VacationPeriodInterface,
  ): string {
    const type = statusTypesMap[period.typeId];
    return type?.color;
  }

  getPeriodGroupId(
    item: VacationItemComputed,
    period: VacationPeriodInterface,
  ): string {
    return `${item.employeeId}-${period.typeId}-${period.startDate}-${period.endDate}`;
  }

  getShortName = this.utils.getEmployeeShortName;

  formatDayName(day: number): string {
    return day < 9 ? `0${day + 1}` : `${day + 1}`;
  }
}
