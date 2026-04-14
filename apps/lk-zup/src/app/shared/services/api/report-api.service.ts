import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environment } from '@shared/classes/ennvironment/environment';
import { FileBase64 } from '@shared/models/files.interface';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { Observable } from 'rxjs';

export interface GetReportParamsInterface {
  employeeId?: string;
  employeeIds?: string[];
  currentEmployeeId?: string;
  dateBegin?: Date;
  dateEnd?: Date;
  reportId?: string;
  format?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ReportApiService {
  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
  ) {}

  getReport(params: GetReportParamsInterface): Observable<FileBase64> {
    const currentEmployeeId: string =
      params.currentEmployeeId ||
      this.localStorageService.getCurrentEmployeeId();

    if (!currentEmployeeId) {
      throw new Error(`Failed to get current employee id from localStorage!`);
    }

    const { reportId, dateBegin, dateEnd } = params;

    const paramsToServer: any = structuredClone(params);
    if (paramsToServer.employeeIds)
      paramsToServer.employeesId = paramsToServer.employeeIds.join(',');
    delete paramsToServer.employeeIds;
    if (dateBegin) paramsToServer.dateBegin = dateBegin.toISOString();
    if (dateEnd) paramsToServer.dateEnd = dateEnd.toISOString();

    return this.http.post<FileBase64>(
      `${
        Environment.inv().api
      }/wa_employee/${currentEmployeeId}/customReport/${reportId}`,
      paramsToServer,
    );
  }
}
