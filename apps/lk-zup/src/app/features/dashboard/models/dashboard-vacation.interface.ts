import {
  IssuesHistoryInterface,
  IssuesHistoryItem,
} from '@features/issues/models/issues-history.interface';
import { IssuesInterface } from '@features/issues/models/issues.interface';

export interface DashboardVacationInterface {
  vacations?: VacationArrayInterface[];
  vacationsCount?: number;
  employeeID: string;
}

export interface VacationArrayInterface {
  vacationBegin?: string;
  vacationTypeID?: string;
  vacationTypeId?: string;
  vacationEnd?: string;
  vacationDays?: number;
  vacationRescheduled: boolean;
  issueId?: string | null;
  vacationConfirmationAvailable: boolean;
  vacationReshedulingAvailable: boolean;
  vacationIsActual: boolean;
  vacationReshedulingAlias: string;
  stateId: string;
}

export interface DashboardVacationTotalInterface {
  vacations?: VacationAllInterface[];
  vacationsTotal?: string;
  header?: string;
}

export interface VacationAllInterface {
  vacationID?: 'string';
  vacationName?: 'string';
  vacationBalance?: 'string';
}

export interface VacationTotalDateInterface {
  currentEmployeeId: string;
  date: string;
}
