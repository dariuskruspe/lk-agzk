/**
 * Интерфейс для праздничного дня.
 */
export interface HolidayInterface {
  // Номер дня месяца (от 1 до 31).
  day: number;
  // Номер месяца (0 — для января, ..., 11 — для декабря).
  month: number;
  // Название праздника
  name: string;
}
