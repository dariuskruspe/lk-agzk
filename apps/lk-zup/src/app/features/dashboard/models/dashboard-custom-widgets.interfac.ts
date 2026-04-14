import { SupportHelpBlockInterface } from "@app/features/support/models/support-help.interface";

export interface DashboardCustomWidgetsInterface {
  id: string;
  title: string;
  iconName: string;
  description: string;
  order: number;
  toggleAvailable: boolean;
  display: boolean;
  hidePeriodSelection: boolean;
  periodType: 'day' | 'year' | 'month' | 'custom';
  dateBegin: string;
  dateEnd: string;
  markup?: SupportHelpBlockInterface[];
  template?: string;
}
