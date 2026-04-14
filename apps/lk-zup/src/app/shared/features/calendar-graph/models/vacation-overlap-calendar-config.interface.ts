// Интерфейс конфигурации календаря пересечений отпусков сотрудника с отпусками выбранного (кнопкой "Пересечения") сотрудника в графике отпусков
export interface VacationOverlapCalendarConfigInterface {
  /**
   * Ширина дня (в пикселях).
   */
  dayWidthPx?: number;

  /**
   * Высота дня (в пикселях).
   */
  dayHeightPx?: number;
}
