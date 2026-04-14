import {VacationPeriodInterface} from "@features/vacations/models/vacations.interface";

export interface VacationsApprovalInterface {
  employeeId: string;
  comment?: string;
  periods?: VacationPeriodInterface[];
}

export enum VacationActionEnum {
  approve = 'approve',
  discard = 'discard',
  save = 'save',
}
