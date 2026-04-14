import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { AgreementsReports } from '../models/agreement-report.interface';
import { AgreementReportState } from '../states/agreement-report.state';

@Injectable({
  providedIn: 'root',
})
export class AgreementReportFacade extends AbstractFacade<AgreementsReports> {
  constructor(protected geRx: GeRx, protected store: AgreementReportState) {
    super(geRx, store);
  }

  getFile(filePath: string): void {
    this.geRx.show(this.store.entityName, { filePath });
  }
}
