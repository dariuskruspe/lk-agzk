export interface CalendarGraphInterface {
  showType: 'month' | 'year';
  membersShow: boolean;
  graphType: 'timesheet' | 'schedule';
  date: string;
  endDate: string;
  showWorkTime: boolean;
  showDaysOff: boolean;
  managementMode: boolean;
}
