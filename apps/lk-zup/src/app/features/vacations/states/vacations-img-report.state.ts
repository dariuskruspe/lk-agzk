import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { VacationsImgReportService } from '../sevices/vacations-img-report.service';

@Injectable({
  providedIn: 'root',
})
export class VacationsImgReportState {
  public entityName = 'vacationsImgReport';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.vacationsImgReportService.showVacationsImgReport.bind(
        this.vacationsImgReportService
      ),
    },
  };

  constructor(private vacationsImgReportService: VacationsImgReportService) {}
}
