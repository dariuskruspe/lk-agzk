import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { ReportInterface } from '../../../shared/features/report-dialog/models/report.interface';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { DashboardVacationImgReportState } from '../states/dashboard-vacation-img-report.state';

@Injectable({
  providedIn: 'root',
})
export class DashboardVacationImgReportFacade
  extends AbstractFacade<DashboardVacationImgReportFacade>
  implements ReportInterface
{
  constructor(
    protected geRx: GeRx,
    protected store: DashboardVacationImgReportState,
    private localstorageService: LocalStorageService,
  ) {
    super(geRx, store);
  }

  getFile(data: {
    reportId: string;
    dateBegin: string;
    dateEnd: string;
  }): void {
    const currentEmployeeId = this.localstorageService.getCurrentEmployeeId();
    this.geRx.show(this.store.entityName, {
      currentEmployeeId,
      data,
    });
  }
}
