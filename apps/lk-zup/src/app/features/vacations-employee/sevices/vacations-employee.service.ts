import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Environment } from '../../../shared/classes/ennvironment/environment';
import {
  EmployeeInterface,
  EmployeeListItemInterface,
  VacationEmployeeDownloadInterface,
} from '../models/vacations.interface';

@Injectable({
  providedIn: 'root',
})
export class VacationsEmployeeService {
  constructor(private http: HttpClient) {}

  getMembers(
    currentEmployeeId: string,
    name: string,
    date: Date
  ): Observable<EmployeeInterface[]> {
    const tempParams = {
      search: name,
      date: date ? date.toISOString() : undefined,
    };
    const params = JSON.parse(JSON.stringify(tempParams));
    return this.http
      .get<{ members: EmployeeInterface[] }>(
        `${Environment.inv().api}/members/${currentEmployeeId}/vacations`,
        { params }
      )
      .pipe(map((result) => result.members));
  }

  getEmployees(
    currentEmployeeId: string
  ): Observable<EmployeeListItemInterface[]> {
    return this.http.get<EmployeeListItemInterface[]>(
      `${Environment.inv().api}/members/${currentEmployeeId}/vacations/list`
    );
  }

  downloadById(
    currentEmployeeId: string,
    id: string
  ): Observable<VacationEmployeeDownloadInterface> {
    return this.http.post<VacationEmployeeDownloadInterface>(
      `${
        Environment.inv().api
      }/wa_employee/${currentEmployeeId}/customReport/subordinatesVacationBalance`,
      {
        reportId: 'subordinatesVacationBalance',
        employeesId: id,
        dateBegin: new Date().toISOString(),
      }
    );
  }

  downloadSelected(
    ids: string[],
    currentEmployeeId: string,
    date: Date,
    format: 'xlsx' | 'pdf'
  ): Observable<VacationEmployeeDownloadInterface> {
    const tempParams = {
      employeesId: ids.join(','),
      dateBegin: date ? date.toISOString() : undefined,
      format,
      reportId: 'subordinatesVacationBalance',
    };
    const params = JSON.parse(JSON.stringify(tempParams));
    return this.http.post<VacationEmployeeDownloadInterface>(
      `${
        Environment.inv().api
      }/wa_employee/${currentEmployeeId}/customReport/subordinatesVacationBalance`,
      params
    );
  }
}
