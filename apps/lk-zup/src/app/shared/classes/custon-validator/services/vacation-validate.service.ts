import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environment } from '../../ennvironment/environment';

@Injectable({
  providedIn: 'root',
})
export class VacationValidateService {
  constructor(private http: HttpClient) {}

  isPeriodValid(params: { startDate: string; endDate: string }): Promise<void> {
    return this.http
      .get<void>(`${Environment.inv().api}/vacationSchedule/isPeriodValid`, {
        params,
      })
      .toPromise();
  }
}
