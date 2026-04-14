import { SignatureInfoInterface } from '../../../shared/features/signature-validation-form/models/signature-info.interface';
import { FormDataInterface } from '../../../shared/features/success-window/models/success-window.interface';
import { IssuesTypesTemplateInterface } from './issues-types.interface';

export interface IssuesJoinInterface {
  issue?: IssuesInterface;
  issueType?: IssuesTypesTemplateInterface;
  count?: number;
}

export interface IssuesListInterface {
  issues: IssuesInterface[];
  count: number;
}

export interface IssuesInterface {
  IssueID?: string;
  IssueTypeID?: string;
  issueTypeID?: string;
  issueType?: string;
  stateID?: string;
  number?: string;
  date?: string | FormDataInterface;
  iconName?: string;
  typeShortName?: string;
  state?: string;
  isOrder?: boolean;
  header?: string;
  contents?: string;
  changeStatusDate?: string;
  employeeName?: string;
  viewed?: boolean;
  attachedFiles?: boolean;
  taskID?: string;
  dateStart?: Date;
  dateEnd?: Date;
  signatureEnable?: boolean;
  providers?: SignatureInfoInterface[] | null;
  message?: {
    header?: string;
    text?: string;
  };
  formData?: {
    [key: string]: string | number | { [key: string]: string | number }[];
  };
  success: boolean;
  block?: boolean;
  periodCrossingData?: { text: string; issueID: string }[];
  createWithoutPeriodsCheck?: boolean;
  linkedIssues: {
    documentId: string;
    issueId: string;
    issueName: string;
    issueTypeId: string;
    issueCreateButtonName: string;
    issueOpenButtonName: string;
  }[];
  stateOrder?: number;
  actions?: {
    copyingAllowed?: boolean;
  };
}

export interface IssuesStatusInterface {
  states: IssuesStatusListInterface[];
}

export interface IssuesStatusListInterface {
  id: string;
  name: string;
  color: string;
  code: number;
  approve?: boolean;
  searchTarget: string[];
  cancelAccess: boolean;
  icon: string;
  description: string;
}

export interface IssuesListFormFilter {
  search?: string;
  state?: string;
  page: number;
  count: number;
}

export interface IBalanceByType {
  vacationID: string;
  vacationName: string;
  vacationBalance: number;
}

export interface IssueCancelInterface {
  issueID: string;
  comment: string;
  skipControl?: boolean;
}

export interface UnscheduledVacationInterface {
  vacation: IBalanceByType | null;
  dateBegin: Date | null;
  dateEnd: Date | null;
  vacationTypeID?: string;
}
export interface IssuesListFormFilterValueInterface {
  search: string;
  state?: string;
  page: number;
  count: number;
  useSkip: boolean;
  days?: string;
  type: string[];
}
