export interface DashboardVacationReportsInterface {
  name: string;
  description: string;
  dateBegin: string;
  dateEnd: string;
  period: 'day' | 'year' | 'month' | 'custom';
  reportId: string;
  formats: string[];
  hidePeriodSelection?: boolean;
}
