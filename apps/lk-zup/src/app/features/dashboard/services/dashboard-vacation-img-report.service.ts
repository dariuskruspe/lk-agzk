import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, SubscriptionLike } from 'rxjs';
import { Environment } from '../../../shared/classes/ennvironment/environment';
import { SalariesImgReportInterface } from '../../salaries/models/salaries-img-report.interface';
import { DashboardVacationReportsReqInterface } from '../models/dashboard-vacation-reports-req.interface';

@Injectable({
  providedIn: 'root',
})
export class DashboardVacationImgReportService {
  private subscription: SubscriptionLike;

  constructor(private http: HttpClient) {}

  showVacationImgReport(info: {
    currentEmployeeId: string;
    data: DashboardVacationReportsReqInterface;
  }): Observable<SalariesImgReportInterface> {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    let body: any = {};
    if (info.data) {
      body = JSON.parse(JSON.stringify(info.data));
    }
    return new Observable((subscriber) => {
      this.subscription = this.http
        .post<SalariesImgReportInterface>(
          `${Environment.inv().api}/wa_employee/${
            info.currentEmployeeId
          }/customReport/${info.data.reportId}`,
          body,
        )
        .subscribe(subscriber);
    });
  }
}
