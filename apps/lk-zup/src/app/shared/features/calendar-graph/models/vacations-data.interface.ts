import {
  VacationPeriodInterface,
  VacationsInterface,
} from '@features/vacations/models/vacations.interface';

// Интерфейс данных, касающихся отпусков сотрудника (перенесено из calendar-graph-container.component.ts -> convertedData)
export interface VacationsDataInterface {
  name: string;
  hasIntersection: boolean;
  employeeId: string;
  vacations: {
    daysCount: number;
    daysFromStart: number;
    color: string;
    status: string;
    approved: boolean;
    fullPeriod: VacationPeriodInterface;
  }[][];
  fullVacation: VacationsInterface;
}
