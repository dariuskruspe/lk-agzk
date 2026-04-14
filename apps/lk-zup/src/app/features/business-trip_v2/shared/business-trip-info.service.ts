import { inject, Injectable } from '@angular/core';
import { BusinessTripsInfoDialogComponent } from '@app/features/business-trips/components/business-trips-info-dialog/business-trips-info-dialog.component';
import {
  VacationPeriodInterface,
  VacationsInterface,
} from '@app/features/vacations/models/vacations.interface';
import { VacationsGraphStatusTypesFacade } from '@app/features/vacations/facades/vacations-graph-status-types.facade';
import { DialogService } from 'primeng/dynamicdialog';
import { TranslatePipe } from '@app/shared/features/lang/pipes/lang.pipe';
import { BusinessTripService } from './business-trip.service';

@Injectable({
  providedIn: 'root',
})
export class BusinessTripInfoService {
  private businessTripService = inject(BusinessTripService);
  private dialogService = inject(DialogService);
  private translatePipe = inject(TranslatePipe);
  private vacationsGraphStatusTypesFacade = inject(VacationsGraphStatusTypesFacade);

  showPeriodInfo(
    event: Event,
    trip: VacationsInterface,
    period: VacationPeriodInterface,
  ) {
    const statusTypes = this.vacationsGraphStatusTypesFacade.getData() || [];
    const statusType = statusTypes.find((s) => s.id === period.typeId);

    this.dialogService.open(BusinessTripsInfoDialogComponent, {
      header: this.translatePipe.transform('TITLE_BUSINESS_TRIPS'),
      data: {
        dateStart: period.startDate,
        dateEnd: period.endDate,
        count: period.daysLength,
        name: trip.name,
        status: period.status,
        issueId: period.issueId,
        documentId: period.documentId,
        pointType: statusType,
        enableButtons: true,
        enableReportButtons: true,
        linkedIssueTypeId: period.linkedIssueTypeId,
        linkedIssueId: period.linkedIssueId,
        cancelAccess: period.cancelAccess,
      },
    });
  }
}
