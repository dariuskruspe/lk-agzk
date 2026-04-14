import { inject, Injectable } from '@angular/core';
import { VacationsInfoDialogComponent } from '@app/features/vacations/components/vacations-info-dialog/vacations-info-dialog.component';
import {
  VacationPeriodInterface,
  VacationsInterface,
} from '@app/features/vacations/models/vacations.interface';
import { DialogService } from 'primeng/dynamicdialog';
import { VacationsService } from './vacations.service';

@Injectable({
  providedIn: 'root',
})
export class VacationInfoService {
  private vacationsService = inject(VacationsService);
  private dialogService = inject(DialogService);

  showPeriodInfo(
    event: Event,
    vacation: VacationsInterface,
    period: VacationPeriodInterface,
  ) {
    const dialogRef = this.dialogService.open(VacationsInfoDialogComponent, {
      data: {
        event,
        period,
        vacation,
        states: {
          states: this.vacationsService.states(),
        },
      },
    });
  }
}
