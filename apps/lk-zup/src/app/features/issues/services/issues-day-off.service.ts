import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Environment } from '../../../shared/classes/ennvironment/environment';

@Injectable({
  providedIn: 'root',
})
export class IssuesDayOffService {
  constructor(private http: HttpClient) {}

  getDayOff(data: { date: string; currentEmployeeId: string }): Observable<{
    employeeID: string;
    date: string;
    isDayOff: boolean;
  }> {
    return this.http.get<{
      employeeID: string;
      date: string;
      isDayOff: boolean;
    }>(
      `${Environment.inv().api}/wa_employee/${
        data.currentEmployeeId
      }/isDayOff/${data.date}`
    );
  }
}
