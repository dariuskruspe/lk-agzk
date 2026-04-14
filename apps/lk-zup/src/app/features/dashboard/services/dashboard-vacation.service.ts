import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Environment } from '../../../shared/classes/ennvironment/environment';
import {
  DashboardVacationInterface,
  VacationAllInterface,
  VacationTotalDateInterface,
} from '../models/dashboard-vacation.interface';

@Injectable({
  providedIn: 'root',
})
export class DashboardVacationService {
  constructor(private http: HttpClient) {}

  getVacationArray(
    employeeID: string | number
  ): Observable<DashboardVacationInterface> {
    return this.http
      .get<DashboardVacationInterface>(
        `${Environment.inv().api}/wa_employee/${employeeID}/vacationArray`
      )
      .pipe(
        map((item) => {
          return {
            ...item,
            vacations: item.vacations.map((period) => ({
              ...period,
              vacationTypeId: period.vacationTypeID,
            })),
          };
        })
      );
  }

  getVacationTotalDate(data: VacationTotalDateInterface): Observable<{
    vacationsTotal: number;
    vacations: VacationAllInterface[];
    header: string;
  }> {
    let httpParams = new HttpParams();
    if (data.date) {
      httpParams = httpParams.append('date', data.date);
    }
    return this.http.get<{
      vacationsTotal: number;
      vacations: VacationAllInterface[];
      header: string;
    }>(
      `${Environment.inv().api}/wa_employee/${
        data.currentEmployeeId
      }/vacationBalance`,
      { params: httpParams }
    );
  }

  getVacationTotal(employeeID: string | number): Observable<{
    vacationsTotal: number;
    vacations: VacationAllInterface[];
  }> {
    return this.http.get<{
      vacationsTotal: number;
      vacations: VacationAllInterface[];
    }>(`${Environment.inv().api}/wa_employee/${employeeID}/vacationBalance`);
  }
}
