import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class VacationScheduleService {
  /**
   * Сигнал, содержащий выбранный пользователем месяц и/или год (в виде даты), за который отображаются отпуска на
   * странице "Отпуска сотрудников" или "График отпусков".
   */
  selectedDateSignal: WritableSignal<Date> = signal(new Date());
}
