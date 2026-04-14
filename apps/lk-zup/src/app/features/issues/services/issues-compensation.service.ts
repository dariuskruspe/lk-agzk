import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Environment } from '../../../shared/classes/ennvironment/environment';
import { IBalanceByType } from '../models/issues.interface';

@Injectable({
  providedIn: 'root',
})
export class IssuesCompensationService {
  constructor(private http: HttpClient) {}

  vacationBalanceByTypes(data: string): Observable<IBalanceByType> {
    return this.http.get<IBalanceByType>(
      `${Environment.inv().api}/wa_employee/${data}/vacationBalanceByTypes`
    );
  }

  vacationBalanceByTypesID(data: string): Observable<IBalanceByType> {
    return this.http.get<IBalanceByType>(
      `${Environment.inv().api}/wa_employee/${data}/vacationBalanceByTypesID`
    );
  }

  vacationBalance(
    data: string
  ): Observable<{ vacations: IBalanceByType[]; vacationsTotal: number }> {
    return this.http.get<{
      vacations: IBalanceByType[];
      vacationsTotal: number;
    }>(`${Environment.inv().api}/wa_employee/${data}/vacationBalance`);
  }

  vacationBalanceByDate(data: {
    currentEmployeeId: string;
    date: Date;
  }): Observable<{ vacations: IBalanceByType[]; vacationsTotal: number }> {
    let httpParams = new HttpParams();
    if (data.date) {
      httpParams = httpParams.append('date', data.date.toISOString());
    }
    return this.http.get<{
      vacations: IBalanceByType[];
      vacationsTotal: number;
    }>(
      `${Environment.inv().api}/wa_employee/${
        data.currentEmployeeId
      }/vacationBalance`,
      { params: httpParams }
    );
  }
}
