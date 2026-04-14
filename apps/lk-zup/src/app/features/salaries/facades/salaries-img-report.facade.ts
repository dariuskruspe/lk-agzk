import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { ReportInterface } from '../../../shared/features/report-dialog/models/report.interface';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { SalariesImgReportState } from '../states/salaries-img-report.state';

@Injectable({
  providedIn: 'root',
})
export class SalariesImgReportFacade
  extends AbstractFacade<SalariesImgReportFacade>
  implements ReportInterface
{
  constructor(
    protected geRx: GeRx,
    protected store: SalariesImgReportState,
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
