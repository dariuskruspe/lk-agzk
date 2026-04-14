import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { SalariesImgReportService } from '../services/salaries-img-report.service';

@Injectable({
  providedIn: 'root',
})
export class SalariesImgReportState {
  public entityName = 'salariesImgReport';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.salariesImgReportService.showSalariesImgReport.bind(
        this.salariesImgReportService
      ),
    },
  };

  constructor(private salariesImgReportService: SalariesImgReportService) {}
}
