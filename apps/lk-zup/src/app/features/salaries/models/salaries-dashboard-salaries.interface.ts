export interface SalariesDashboardSalariesInterface {
  balanceSum: number;
  balanceText: string;
  dateText: string;
  deductions: SalariesDashboardPaylogInterface;
  earnings: SalariesDashboardPaylogInterface;
  payments: SalariesDashboardPaylogInterface;
  payMethod: string;
  netPayDate?: string;
  netPaySum?: number;
}

export interface SalariesDashboardPaylogInterface {
  items: SalariesDashboardPaylogItemInterface[];
  total: number;
}

export interface SalariesDashboardPaylogItemInterface {
  date: string;
  name: string;
  sum: number;
}
