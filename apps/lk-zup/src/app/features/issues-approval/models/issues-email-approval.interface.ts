export interface IssuesEmailApprovalInterface {
  taskId?: string;
  approverId?: string;
  approve?: boolean;
  issueId?: string;
  needAuthorization?: boolean;
  lang: string;
  taskType?: 'issue' | 'vacationSchedule';
  employeeId?: string;
  year?: number | null;
  comment?: string;
}

export interface IssuesEmailApprovalQueryInterface {
  taskId?: string;
  issueId?: string;
  approverId?: string;
  approve?: string;
  needAuthorization?: string;
  lang?: string;
  taskType?: 'issue' | 'vacationSchedule';
  employeeId?: string;
  year?: string;
  /**
   * Согласование/отклонение заявки соответствующими кнопками прямо из почты
   * (true = заявка согласована/отклонена из почты, false = заявка должна быть согласована/отклонена из ЛКС)
   */
  fromEmail?: string;
  periods?: string;
}

export interface IssuesEmailApprovalInterfaceOld {
  message?: string;
  state?: string;
}
