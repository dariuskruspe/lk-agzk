import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Environment } from '../../../shared/classes/ennvironment/environment';
import {
  VacationsImgReportInputInterface,
  VacationsImgReportInterface,
} from '../models/vacations-img-report.interface';

@Injectable({
  providedIn: 'root',
})
export class VacationsImgReportService {
  constructor(private http: HttpClient) {}

  showVacationsImgReport(
    data: VacationsImgReportInputInterface
  ): Observable<VacationsImgReportInterface> {
    const modData = data;
    modData.date = modData.date ?? new Date().toISOString();
    return this.http.post<VacationsImgReportInterface>(
      `${Environment.inv().api}/wa_employee/${
        modData.currentEmployeeId
      }/customReport/vacationBalance`,
      {
        dateBegin: modData.date,
        reportId: 'vacationBalance',
      }
    );
  }
}
