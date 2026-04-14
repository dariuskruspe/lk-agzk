import { VacationPeriodInterface } from '@features/vacations/models/vacations.interface';
import { WorkStatusInterface } from '@shared/features/calendar-graph/models/calendar-graph-member-list.interface';

// Интерфейс календаря пересечений отпусков сотрудника с отпусками выбранного (кнопкой "Пересечения") сотрудника в графике отпусков
export interface VacationOverlapCalendarInterface {
  /**
   * UUID сотрудника.
   */
  employeeId?: string;

  /**
   * ФИО сотрудника.
   */
  employeeFullName?: string;

  /**
   * Периоды отпусков сотрудника, пересекающиеся с выбранным периодом отпусков указанного сотрудника.
   */
  matchedPeriods?: VacationOverlapPeriodInterface[];
}

export interface VacationOverlapPeriodInterface
  extends VacationPeriodInterface {
  /**
   * Массив календарей месяцев, входящих в выбранный период отпуска указанного сотрудника.
   */
  matchedMonths?: VacationOverlapCalendarMonthInterface[];
}

// Интерфейс месяца в календаре пересечений отпусков сотрудника с отпусками выбранного (кнопкой "Пересечения") сотрудника в графике отпусков
export interface VacationOverlapCalendarMonthInterface {
  /**
   * Название месяца.
   */
  name?: string;

  /**
   * Массив, содержащий объекты с данными, предназначенными для отображения дней месяца.
   */
  days?: VacationOverlapCalendarDayInterface[];

  /**
   * Год, соответствующий отображаемому месяцу (например: 2000).
   */
  year?: number;
}

// Интерфейс дня в календаре пересечений отпусков сотрудника с отпусками выбранного (кнопкой "Пересечения") сотрудника в графике отпусков
export interface VacationOverlapCalendarDayInterface {
  /**
   * Дата, соответствующая дню месяца.
   */
  date?: Date;

  /**
   * Номер дня в месяце.
   */
  number?: number;

  /**
   * Короткое название дня недели (например: 'пн').
   */
  shortName?: string;

  /**
   * Является ли данный день выходным (субботой/воскресеньем).
   */
  isWeekend: boolean;

  /**
   * Является ли данный день нерабочим праздничным днём (то есть праздником, таким как Новый год,
   * 23 февраля, 8 марта и т. д.) согласно Трудовому кодексу Российской Федерации.
   */
  isHolidayRU: boolean;

  /**
   * Название праздника (например, "Новый год") согласно Трудовому кодексу Российской Федерации.
   */
  holidayRUName: string;

  /**
   * Является ли данный день отпуском (или его частью) для сотрудника.
   */
  isVacation?: boolean;

  /**
   * Является ли данный день отпуском вне графика (или частью такого отпуска) для сотрудника.
   */
  isCustomVacation: boolean;

  /**
   * Пересекается ли данный день в календаре пересечений отпусков сотрудника с отпусками выбранного сотрудника за указанный период.
   */
  isVacationOverlap?: boolean;

  /**
   * Рабочий статус сотрудника в этот день.
   */
  workStatus?: WorkStatusInterface;
}
