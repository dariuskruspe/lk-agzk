import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FileBase64 } from '@shared/models/files.interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Environment } from '../../../shared/classes/ennvironment/environment';
import {
  UserDataInterface,
  UserPersonalDataInterface,
} from '../../users/models/user-personal-data.interface';
import {
  EmployeeStateListInterface,
  SubordinatesResponseInterface,
} from '../models/employees.interface';
import { StaticDataResource } from '@app/shared/api-resources/static-data.resource';
import { injectResource } from '@app/shared/services/api-resource';
import { EmployeesStateListResource } from '../resources/employees-state-list.resource';

@Injectable({
  providedIn: 'root',
})
export class EmployeesService {
  staticDataResource = injectResource(StaticDataResource);
  employeesStateListResource = injectResource(EmployeesStateListResource);

  constructor(private http: HttpClient) {}

  getStaticData(employeeId: string): Observable<UserDataInterface> {
    return this.staticDataResource.asObservable(employeeId);
  }

  updatingStaticData(data: {
    currentEmployeeId: string;
    fields: string[];
  }): Observable<UserDataInterface> {
    let httpParams = new HttpParams();
    if (data.fields?.length) {
      httpParams = httpParams.append('dataId', data?.fields?.join(','));
    }
    return this.http.get<UserDataInterface>(
      `${Environment.inv().api}/wa_employee/${
        data.currentEmployeeId
      }/staticData`,
      { params: httpParams },
    );
  }

  showEmployeeId(employeeId: string): Observable<UserPersonalDataInterface> {
    return this.http.get<UserPersonalDataInterface>(
      `${Environment.inv().api}/wa_employee/${employeeId}`,
    );
  }

  getSubordinates(
    employeeId: string,
  ): Observable<SubordinatesResponseInterface> {
    return this.http
      .get<SubordinatesResponseInterface>(
        `${Environment.inv().api}/wa_employee/${employeeId}/subordinates`,
      )
      .pipe(
        map((item) => {
          // eslint-disable-next-line no-param-reassign
          item.subordinates = item.subordinates.sort((a, b) => {
            if (a.fullName.toLowerCase() < b.fullName.toLowerCase()) {
              return -1;
            }
            if (a.fullName.toLowerCase() > b.fullName.toLowerCase()) {
              return 1;
            }
            return 0;
          });
          return item;
        }),
      );
  }

  getStateList(): Observable<EmployeeStateListInterface> {
    return this.employeesStateListResource.asObservable();
  }

  getStateFilterList(): Observable<EmployeeStateListInterface> {
    return this.http.get<EmployeeStateListInterface>(
      `${Environment.inv().api}/wa_employee/employeesstates`,
    );
  }

  getArchFile(fileID: string): Observable<FileBase64> {
    return this.http.get<FileBase64>(
      `${Environment.inv().api}${fileID}/base64`,
    );
  }
}
