import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { ReportInterface } from '../../../shared/features/report-dialog/models/report.interface';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { VacationPDFInterface } from '../models/vacations-pdf.interface';
import { VacationsImgReportState } from '../states/vacations-img-report.state';

@Injectable({
  providedIn: 'root',
})
export class VacationsImgReportFacade
  extends AbstractFacade<VacationPDFInterface[]>
  implements ReportInterface
{
  constructor(
    protected geRx: GeRx,
    protected store: VacationsImgReportState,
    private localstorageService: LocalStorageService
  ) {
    super(geRx, store);
  }

  getFile(data: { date: string }): void {
    const currentEmployeeId = this.localstorageService.getCurrentEmployeeId();
    this.geRx.show(this.store.entityName, {
      date: data.date,
      currentEmployeeId,
    });
  }
}
