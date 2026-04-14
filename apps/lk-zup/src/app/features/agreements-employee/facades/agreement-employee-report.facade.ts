import { Injectable } from '@angular/core';
import { AbstractFacade } from '@shared/classes/abstractions/abstract.facade';
import { GeRx } from 'gerx';
import { AgreementsEmployeeReports } from '../models/agreement-employee-report.interface';
import { AgreementEmployeeReportState } from '../states/agreement-employee-report.state';

@Injectable({
  providedIn: 'root',
})
export class AgreementEmployeeReportFacade extends AbstractFacade<AgreementsEmployeeReports> {
  constructor(
    protected geRx: GeRx,
    protected store: AgreementEmployeeReportState
  ) {
    super(geRx, store);
  }

  getFile(filePath: string): void {
    this.geRx.show(this.store.entityName, { filePath });
  }
}
