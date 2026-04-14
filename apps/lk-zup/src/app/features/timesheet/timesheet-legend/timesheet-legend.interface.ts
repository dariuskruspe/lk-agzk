import { LucideIconData } from 'lucide-angular';

export type TimesheetLegendItemVariant =
  | 'filled'
  | 'outlined'
  | 'icon'
  | 'warning'
  | 'hours';

export interface TimesheetLegendItem {
  id: string;
  label: string;
  variant: TimesheetLegendItemVariant;
  color?: string | null;
  backgroundColor?: string | null;
  value?: string;
  icon?: LucideIconData | null;
  iconClass?: string | null;
}
