import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Environment } from '../../../shared/classes/ennvironment/environment';
import { DashboardCustomWidgetsInterface } from '../models/dashboard-custom-widgets.interfac';

@Injectable({
  providedIn: 'root',
})
export class DashboardCustomWidgetsService {
  constructor(private http: HttpClient) {}

  getCustomWidgets(): Observable<DashboardCustomWidgetsInterface[]> {
    return this.http.get<DashboardCustomWidgetsInterface[]>(
      `${Environment.inv().api}/customWidgets`,
    );
  }

  getCustomWidgetById(id: string, date: string): Observable<DashboardCustomWidgetsInterface[]> {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('id', id);
    httpParams = httpParams.append('date', date);
    return this.http.get<DashboardCustomWidgetsInterface[]>(
      `${Environment.inv().api}/customWidgets`,
      { params: httpParams }
    );
  }

  saveCustomWidgetSettings(settings: {id: string, display: boolean, order: number}[]): Observable<any> {
    return this.http.post(
      `${Environment.inv().api}/customWidgets`, {
        settings
      }
    );
  }
}
