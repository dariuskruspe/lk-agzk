export interface DashboardPopularRequestsInterface {
  issueTypes?: PopularRequestsInterface[];
}

export interface PopularRequestsInterface {
  issueTypeDescription?: string | number;
  issueTypeFullName?: string;
  issueTypeID?: string;
  issueTypeIconName?: string;
  issueTypeIsInList?: boolean;
  issueTypeShortName?: string;
  useAsLink: boolean;
  useAsCustomTemplate: boolean;
  issueTypeAlias: string;
  onApplicant?: boolean;
  onOtherEmployees?: boolean;
  onboardingCssClass?: string;
}
