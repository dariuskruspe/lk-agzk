export interface IssueApproveInterfaceSuccess {
  state?: number;
  message?: {
    text: string;
    header?: string;
  };
}

export interface IssueApproveInterfaceError {
  success?: boolean;
  errorCode?: string;
  errorMsg?: string;
}

export interface IssueApproveInterface {
  taskId: string;
  approve: boolean;
  comment?: string;
}
