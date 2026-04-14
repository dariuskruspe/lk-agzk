import { FormDataInterface } from '../../../shared/features/success-window/models/success-window.interface';

export interface TaxListInterface {
  issues: TaxItemInterface[];
  count: number;
}

export interface TaxItemInterface {
  attachedFiles: boolean;
  comment: string;
  date: string | FormDataInterface;
  employee: string;
  employeeID: string;
  iconName: string;
  issueID: string;
  issueType: string;
  issueTypeID: string;
  number: string;
  state: string;
  stateID: string;
  taxAllowanceSize: number;
  taxAllowanceSum: number;
  taxAllowanceStartDate: string;
  user: string;
  userID: string;
}

export interface TaxListFormFilter {
  page: number;
  count: number;
  useSkip: boolean;
  search?: string;
  state?: string;
  search_target?: string[];
}
