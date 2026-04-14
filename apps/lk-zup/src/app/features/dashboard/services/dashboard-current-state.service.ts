import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Environment } from '../../../shared/classes/ennvironment/environment';
import { EmployeeCurrentStateResource } from '@app/shared/api-resources/employee-current-state.resource';
import { injectResource } from '@app/shared/services/api-resource';

@Injectable({
  providedIn: 'root',
})
export class DashboardCurrentStateService {
  private employeeCurrentStateResource = injectResource(
    EmployeeCurrentStateResource,
  );
  constructor(private http: HttpClient) {}

  getStatus(employeeID: string) {
    return this.employeeCurrentStateResource.asObservable(
      employeeID.toString(),
    );
  }
}
