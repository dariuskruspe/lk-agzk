export interface DashboardVacationTask {
  vacationTypeID: string;
  vacationBegin: string;
  vacationEnd: string;
  vacationDays: number;
  vacationRescheduled: boolean;
  vacationConfirmationAvailable: boolean;
  vacationReshedulingAvailable: boolean;
  vacationReshedulingAlias?: string;
  vacationFactReshedulingAvailable: boolean;
  vacationIsActual: boolean;
  issueId: string | null;
  stateId: string | null;
  type: 'vacations';
}

export interface DashboardIssueTask {
  success: boolean;
  IssueID: string;
  number: string;
  date: string;
  IssueTypeID: string;
  typeShortName: string;
  typeFullName: string;
  iconName: string;
  useAsLink: boolean;
  useAsCustomTemplate: boolean;
  isOrder: boolean;
  state: string;
  changeStatusDate: string;
  viewed: boolean;
  attachedFiles: boolean;
  userID: string;
  parentId: string;
  employeeName: string;
  employeePosition: string;
  header: string;
  taskID: string | null;
  signatureEnable: boolean;
  providers: unknown;
  linkedIssues: unknown[];
  type: 'issues';
}

export interface DashboardDocumentTask {
  EIW: unknown | null;
  block: boolean;
  documentsType: string;
  targetPresentationId: number;
  selected: boolean;
  refuseSignatureEnabled: boolean;
  role: string;
  forEmployee: boolean;
  fileID: string;
  fileOwner: string;
  fileName: string;
  employeeName: string;
  taskId: string | null;
  date: string;
  stateDate: string | null;
  state: string;
  name: string;
  mandatory: boolean;
  id: string;
  type: 'documents';
}

export interface DashboardBusinessTripTask {
  startDate: string;
  endDate: string;
  documentId: string;
  documentName: string;
  linkedIssueTypeId: string;
  type: 'businessTrips';
}

export type DashboardTaskItem =
  | DashboardVacationTask
  | DashboardIssueTask
  | DashboardDocumentTask
  | DashboardBusinessTripTask;
