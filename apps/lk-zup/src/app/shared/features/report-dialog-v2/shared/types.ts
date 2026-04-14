import { Observable } from 'rxjs';

export interface ReportDialogV2DialogConfig {
  report: ReportDialogV2Report;
}

export interface ReportDialogV2Report {
  dateBegin: string;
  dateEnd: string;
  reportId: string;
  formats: string[];
}
