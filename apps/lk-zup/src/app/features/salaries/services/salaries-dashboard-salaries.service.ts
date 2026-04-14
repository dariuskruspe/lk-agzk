import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Environment } from '../../../shared/classes/ennvironment/environment';
import { DashboardWorkPeriodsInterface } from '../../dashboard/models/dashboard-work-periods.interface';
import { SalariesDashboardSalariesInterface } from '../models/salaries-dashboard-salaries.interface';
import { SalariesImgReportInputInterface } from '../models/salaries-img-report.interface';

@Injectable({
  providedIn: 'root',
})
export class SalariesDashboardSalariesService {
  constructor(private http: HttpClient) {}

  getWorkPeriods(
    employeeID: string
  ): Observable<DashboardWorkPeriodsInterface> {
    return this.http.get<DashboardWorkPeriodsInterface>(
      `${Environment.inv().api}/wa_employee/${employeeID}/workPeriods`
    );
  }

  getPayslip(
    data: SalariesImgReportInputInterface
  ): Observable<SalariesDashboardSalariesInterface> {
    let httpParams = new HttpParams();
    if (data.date) {
      httpParams = httpParams.append('date', data.date);
    }
    return this.http.get<SalariesDashboardSalariesInterface>(
      `${Environment.inv().api}/wa_payslip/${data.currentEmployeeId}/salary`,
      { params: httpParams }
    );
  }
}
