import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Environment } from '../../../shared/classes/ennvironment/environment';
import { SalariesDashboardIncomeInterface } from '../models/salaries-dashboard-income.interface';

@Injectable({
  providedIn: 'root',
})
export class SalariesDashboardIncomeService {
  constructor(private http: HttpClient) {}

  getPayslipIncome(
    currentEmployeeId: string
  ): Observable<SalariesDashboardIncomeInterface> {
    return this.http.get<SalariesDashboardIncomeInterface>(
      `${Environment.inv().api}/wa_payslip/${currentEmployeeId}/income`
    );
  }
}
