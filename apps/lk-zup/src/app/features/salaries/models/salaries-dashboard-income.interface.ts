export interface SalariesDashboardIncomeInterface {
  currentSalary?: number;
  payMethod?: string;
  averageIncomeLog?: SalariesDashboardAverageIncomeLogInterface[];
  averageIncomeQuartersLog?: SalariesDashboardAverageIncomeLogInterface[];
  changesSalaryLog?: SalariesDashboardChangesSalaryLogInterface[];
}

export interface SalariesDashboardAverageIncomeLogInterface {
  periodName?: string;
  sum?: number;
  dynamics?: number;
}

export interface SalariesDashboardChangesSalaryLogInterface {
  startDate?: string;
  sum?: number;
  dynamics?: number;
}
