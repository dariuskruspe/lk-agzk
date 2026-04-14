export interface DashboardWorkPeriodsInterface {
  reports?: WorkPeriodsInterface[];
}

export interface WorkPeriodsInterface {
  reportId: string;
  name: string;
  description: string;
  dateBegin: string;
  dateEnd: string;
  month: string;
}
