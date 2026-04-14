import { Component } from '@angular/core';
import { DateClass } from '@shared/features/calendar-graph/classes/date.class';
import { TranslatePipe } from '@shared/features/lang/pipes/lang.pipe';
import { MessageSnackbarService } from '@shared/features/message-snackbar/message-snackbar.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BehaviorSubject } from 'rxjs';
import { VacationTypeInterface } from '../../models/vacations-types.interface';
import { AbstractVacationsDialogComponent } from '../abstract-vacation-dialog/abstract-vacations-dialog.component';

@Component({
  selector: 'app-vacations-approve-dialog',
  templateUrl: './vacations-approve-dialog.component.html',
  styleUrls: ['../vacations-edit-dialog/vacations-edit-dialog.component.scss'],
  standalone: false,
})
export class VacationsApproveDialogComponent extends AbstractVacationsDialogComponent {
  types: VacationTypeInterface[];

  constructor(
    public dialogRef: DynamicDialogRef,
    protected config: DynamicDialogConfig,
    protected dateClass: DateClass,
    protected translatePipe: TranslatePipe,
    protected snackbarService: MessageSnackbarService,
  ) {
    super(dialogRef, config, dateClass, translatePipe, snackbarService);

    this.types = this.data.types
      .filter((type) =>
        this.periods.find(
          (period) => period.vacationTypeId === type.vacationTypeId,
        ),
      )
      .sort((a, b) => {
        if (a.main) {
          return -1;
        }
        if (b.main) {
          return 1;
        }
        return 0;
      });
  }

  protected fillForm(): void {
    this.types.forEach((type) => {
      this.forms[type.vacationTypeId] = new BehaviorSubject({
        ...this.formData,
        data: {
          vacations: this.periods
            .filter((period) => period.vacationTypeId === type.vacationTypeId)
            .filter((period) => {
              // Если отпуск на согласовании, показывать только не согласованные отпуска
              if (
                !this.commonPeriod?.approved &&
                this.commonPeriod?.activeApprovement &&
                this.isSubordinated &&
                this.isApprovingAllowed
              ) {
                return !period.approved;
              }
              // Иначе показывать все отпуска
              return true;
            })
            .sort((period1, period2) => {
              return (
                +new Date(period1.startDate) - +new Date(period2.startDate)
              );
            })
            .map((period) => ({
              startDate: this.toISOstring(period.startDate),
              endDate: this.toISOstring(period.endDate),
              disabled: period.approved,
              chosenDates: this.getStaticText(
                this.separateDates(
                  this.toISOstring(period.startDate),
                  this.toISOstring(period.endDate),
                  this.daysOff,
                ),
              ),
            })),
        },
      });
    });
  }
}
