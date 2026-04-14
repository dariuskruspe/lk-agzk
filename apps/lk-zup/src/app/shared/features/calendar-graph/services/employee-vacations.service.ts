import { Injectable, signal, WritableSignal } from '@angular/core';
import { VacationsInterface } from '@features/vacations/models/vacations.interface';
import { CalendarGraphInterface } from '@shared/features/calendar-graph/models/calendar-graph.interface';
import { logDebug } from '@shared/utilits/logger';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EmployeeVacationsService {
  // перенесено из vacations-graph.component.ts
  calendarConfig$: BehaviorSubject<CalendarGraphInterface> =
    new BehaviorSubject<CalendarGraphInterface>(null);

  /**
   * Сигнал, содержащий id выбранных чекбоксами сотрудников на вкладке "К согласованию" страницы "Отпуска сотрудников".
   */
  selectedEmployeeIdsSignal: WritableSignal<string[]> = signal([]);

  /**
   * Сигнал, содержащий данные отпусков выбранных чекбоксами сотрудников на вкладке "К согласованию" страницы "Отпуска сотрудников".
   */
  selectedEmployeeVacationsSignal: WritableSignal<VacationsInterface[]> =
    signal([]);

  /**
   * Сигнал, содержащий значение true или false в зависимости от того, включено ли выделение сотрудников чекбоксами
   * на вкладке "К согласованию" страницы "Отпуска сотрудников".
   */
  enableEmployeeSelectionSignal: WritableSignal<boolean> = signal(false);

  /**
   * Сигнал, содержащий значение true или false в зависимости от того, установлена ли галочка чекбокса, предназначенного
   * для выделения всех сотрудников.
   */
  allEmployeeCheckboxSignal: WritableSignal<boolean> = signal(false);

  /**
   * Сигнал, содержащий отпуска сотрудников, отображающиеся в списке (графике) отпусков на странице "Отпуска
   * сотрудников" или "График отпусков".
   */
  displayedVacationsSignal: WritableSignal<VacationsInterface[]> = signal([]);

  /**
   * Сигнал, содержащий выбранный год на странице "Отпуска сотрудников" или "График отпусков".
   */
  selectedYearSignal: WritableSignal<number> = signal(new Date().getFullYear());

  /**
   * Сигнал, содержащий текущую вкладку (строку с обозначением текущей вкладки) на странице "Отпуска сотрудников".
   */
  vacationsManagementTabSignal: WritableSignal<
    'ALL_VACATIONS' | 'VACATIONS_TO_BE_APPROVED'
  > = signal('ALL_VACATIONS');

  /**
   * Количество подчинённых (текущему пользователю) сотрудников, имеющих отпуска со статусом "К согласованию" для
   * отображения в качестве значения соответствующего счётчика на вкладке "К согласованию" страницы "Отпуска
   * сотрудников".
   */
  vacationsManagementToBeApprovedCountSignal: WritableSignal<number> =
    signal(null);

  setSelectedEmployeeIds(ids: string[]): void {
    this.selectedEmployeeIdsSignal.set(ids);
  }

  setSelectedEmployeeVacations(vacations: VacationsInterface[]): void {
    this.selectedEmployeeVacationsSignal.set(vacations);
  }

  onSelectedEmployeeIdsChange($event: any): void {
    logDebug(`this.selectedEmployeeIds:`, this.selectedEmployeeIdsSignal());
    const selectedEmployeeIds: string[] = this.selectedEmployeeIdsSignal();

    const displayedVacations: VacationsInterface[] =
      this.displayedVacationsSignal() || [];

    const selectedVacations: VacationsInterface[] = displayedVacations.filter(
      (v) => selectedEmployeeIds.includes(v.employeeId)
    );

    const selectedEmployeeIdsCount = selectedEmployeeIds?.length || 0;

    this.selectedEmployeeVacationsSignal.set(selectedVacations);

    this.allEmployeeCheckboxSignal.set(
      selectedEmployeeIdsCount === this.displayedVacationsSignal()?.length
    );

    // this.selectedEmployeeIdsSignal.set($event.checked);
  }
}
