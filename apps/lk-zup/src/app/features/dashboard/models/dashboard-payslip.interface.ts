export interface DashboardPayslipInterface {
  accrued?: string;
  balance?: string;
  date?: string;
  dateText?: string;
  deduction?: string;
  employeeID?: string;
  payout?: string;
}

export interface DashboardWorkPeriod {
  reports: {
    reportId: string;
    name: string;
    description: string;
    dateBegin: string;
    dateEnd: string;
    formats: string[];
    month: string;
  }[];
}

export interface DashboardPopular {
  issueTypes: {
    issueTypeID: string;
    issueTypeShortName: string;
    issueTypeFullName: string;
    issueTypeDescription: string;
    issueTypeIconName: string;
    issueTypeIsInList: boolean;
    issueTypeAlias: string;
    useAsLink: boolean;
    useAsCustomTemplate: boolean;
    onApplicant?: boolean;
    onOtherEmployees?: boolean;
    onboardingCssClass?: string;
  }[];
}
