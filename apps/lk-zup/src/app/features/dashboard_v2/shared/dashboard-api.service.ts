import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Environment } from '@app/shared/classes/ennvironment/environment';
import { LocalStorageService } from '@app/shared/services/local-storage.service';
import { DashboardTaskItem } from '../models/dashboard.interface';
import { Observable } from 'rxjs';
import { VacationAllInterface, VacationTotalDateInterface } from '@app/features/dashboard/models/dashboard-vacation.interface';

@Injectable({
  providedIn: 'root',
})
export class DashboardApiService {
  private http = inject(HttpClient);
  private localStorageService = inject(LocalStorageService);

  getMyTasks() {
    return this.http.get<{ data: DashboardTaskItem[] }>(
      `${Environment.inv().api}/wa_employee/${this.localStorageService.getCurrentEmployeeId()}/dashboard`,
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
      { params: httpParams },
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
