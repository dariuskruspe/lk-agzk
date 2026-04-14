import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Environment } from '../../../shared/classes/ennvironment/environment';
import { DashboardVacationReportsInterface } from '../models/dashboard-vacation-reports.interface';

@Injectable({
  providedIn: 'root',
})
export class DashboardVacationReportsService {
  constructor(private http: HttpClient) {}

  getReports(
    employeeID: string | number
  ): Observable<{ reports: DashboardVacationReportsInterface[] }> {
    return this.http.get<{ reports: DashboardVacationReportsInterface[] }>(
      `${Environment.inv().api}/wa_employee/${employeeID}/customReports`
    );
  }
}
