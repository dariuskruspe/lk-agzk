export interface VacationsGraphFilterInterface {
  date: string | number;
  endDate: string;
  employees: { title: string; value: string }[];
  showType: 'month' | 'year';
  statusId?: string;
  requiringApproval?: boolean;
  hasReport?: boolean;
  hasIntersection?: boolean;
  month?: string | null;
  year?: number;
  departmentIds?: string[];
}
