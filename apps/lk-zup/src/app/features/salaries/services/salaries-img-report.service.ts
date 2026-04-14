import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Environment } from '../../../shared/classes/ennvironment/environment';
import { toUnzonedDate } from '../../../shared/utilits/to-unzoned-date.util';
import {
  SalariesImgReportInputInterface,
  SalariesImgReportInterface,
} from '../models/salaries-img-report.interface';

@Injectable({
  providedIn: 'root',
})
export class SalariesImgReportService {
  constructor(private http: HttpClient) {}

  showSalariesImgReport(
    data: SalariesImgReportInputInterface
  ): Observable<SalariesImgReportInterface> {
    let body: any = {};
    if (data.date) {
      const date = new Date(data.date);
      body.dateBegin = toUnzonedDate(
        new Date(date.getFullYear(), date.getMonth(), 1)
      ).toISOString();
      body.dateEnd = toUnzonedDate(
        new Date(date.getFullYear(), date.getMonth() + 1, 0)
      ).toISOString();
      body.reportId = 'payslip';
    }
    return this.http.post<SalariesImgReportInterface>(
      `${Environment.inv().api}/wa_employee/${
        data.currentEmployeeId
      }/customReport/payslip`,
      body
    );
  }
}
