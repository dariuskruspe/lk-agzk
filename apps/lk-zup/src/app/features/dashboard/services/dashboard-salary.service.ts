import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Environment } from '../../../shared/classes/ennvironment/environment';
import {
  DashboardPayslipInterface,
  DashboardWorkPeriod,
} from '../models/dashboard-payslip.interface';
import { injectResource } from '@app/shared/services/api-resource';
import { CustomReportsResource } from '../resources/custom-reports.resource';

@Injectable({
  providedIn: 'root',
})
export class DashboardSalaryService {
  private customReportsResource = injectResource(CustomReportsResource);

  constructor(private http: HttpClient) {}

  getWorkPeriods(employeeID: string): Observable<DashboardWorkPeriod> {
    return this.customReportsResource.asObservable(employeeID, 'payslip');
  }

  getPayslip(data: {
    currentEmployeeId: string;
    date: string;
  }): Observable<DashboardPayslipInterface> {
    let httpParams = new HttpParams();
    if (data.date) {
      httpParams = httpParams.append('date', data.date);
    }
    return this.http.get<DashboardPayslipInterface>(
      `${Environment.inv().api}/wa_employee/${data.currentEmployeeId}/payslip`,
      { params: httpParams },
    );
  }
}
