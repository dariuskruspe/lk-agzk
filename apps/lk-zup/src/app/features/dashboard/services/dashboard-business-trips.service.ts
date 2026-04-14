import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DashboardBusinessTripsInterface } from '@features/dashboard/models/dashboard-business-trips.interface';
import { Observable } from 'rxjs';
import { Environment } from '../../../shared/classes/ennvironment/environment';

@Injectable({
  providedIn: 'root',
})
export class DashboardBusinessTripsService {
  constructor(private http: HttpClient) {}

  getBusinessTrips(): Observable<DashboardBusinessTripsInterface[]> {
    return this.http.get<DashboardBusinessTripsInterface[]>(
      `${Environment.inv().api}/timesheet/documentsWidget`,
      { params: { sectionId: 'dashboard_businessTrips', count: 3 } }
    );
  }
}
