export interface IssuesManagementInterfaces {
  issues: IssuesManagementListInterfaces[];
  count: number;
}

export interface IssuesManagementItemInterfaces {
  issue: IssuesManagementListInterfaces;
}

export interface IssuesManagementListInterfaces {
  IssueID: string;
  IssueTypeID: string;
  changeStatusDate: string;
  date: string;
  header: string;
  iconName: string;
  number: string;
  state: string;
  typeFullName: string;
  typeShortName: string;
  employeeName: string;
  employeePosition: string;
  viewed: boolean;
  attachedFiles: boolean;
  taskID?: string | null;
  taskId?: string;
  color?: string;
  status?: string;
}

export interface IssuesManagementFilterInterface {
  search?: string;
  status?: string;
  days?: number;
  page?: number;
  count?: number;
}

export interface IssuesManagementApproveResponse {
  success: boolean;
  errorCode?: string;
  errorMsg: string;
  taskId: string;
}
