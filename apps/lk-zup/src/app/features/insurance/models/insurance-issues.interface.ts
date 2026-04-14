import { FormDataInterface } from '../../../shared/features/success-window/models/success-window.interface';

export interface InsuranceIssues {
  count: number;
  issues: InsuranceIssue[];
}
export interface InsuranceIssue {
  dateStart: Date;
  stateID: string;
  state: string;
  employeeID: string;
  employee: string;
  attachedFiles: boolean;
  iconName: string;
  issueTypeID: string;
  issueType: string;
  issueTypeFullName: string;
  userID: string;
  user: string;
  comment: string;
  date?: string | FormDataInterface;
  dateEnd: Date;
  number: string;
  issueID: string;
  description: string;
}
