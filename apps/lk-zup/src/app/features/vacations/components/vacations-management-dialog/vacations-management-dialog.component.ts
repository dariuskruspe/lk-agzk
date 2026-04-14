import { CommonModule } from '@angular/common';
import { Component, inject, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import {
  VacationActionEnum,
  VacationsApprovalInterface,
} from '@features/vacations/models/vacations-approval.interface';
import { VacationsGraphService } from '@features/vacations/sevices/vacations-graph.service';
import { EmployeeVacationsService } from '@shared/features/calendar-graph/services/employee-vacations.service';
import { VacationScheduleService } from '@shared/features/calendar-graph/services/vacation-schedule.service';
import { LangModule } from '@shared/features/lang/lang.module';
import { TranslatePipe } from '@shared/features/lang/pipes/lang.pipe';
import { MessageSnackbarService } from '@shared/features/message-snackbar/message-snackbar.service';
import { MessageType } from '@shared/features/message-snackbar/models/message-type.enum';
import { AppService } from '@shared/services/app.service';
import { Button, ButtonDirective } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PaginatorModule } from 'primeng/paginator';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-vacations-management-dialog',
    imports: [
        CommonModule,
        ButtonDirective,
        InputTextareaModule,
        LangModule,
        PaginatorModule,
        Button,
    ],
    templateUrl: './vacations-management-dialog.component.html',
    styleUrl: './vacations-management-dialog.component.scss'
})
export class VacationsManagementDialogComponent {
  app: AppService = inject(AppService);

  dialogConfig: DynamicDialogConfig = inject(DynamicDialogConfig);

  dialogRef: DynamicDialogRef = inject(DynamicDialogRef);

  employeeVacationsService: EmployeeVacationsService = inject(
    EmployeeVacationsService
  );

  router: Router = inject(Router);

  toastService: MessageSnackbarService = inject(MessageSnackbarService);

  translatePipe: TranslatePipe = inject(TranslatePipe);

  vacationsGraphService: VacationsGraphService = inject(VacationsGraphService);

  vacationScheduleService: VacationScheduleService = inject(
    VacationScheduleService
  );

  selectedDateSignal: WritableSignal<Date> =
    this.vacationScheduleService.selectedDateSignal;

  action: 'approve' | 'decline' = this.dialogConfig?.data?.action || 'decline';

  comment: string;

  loading: boolean = false;

  async confirmVacationsDecision(): Promise<void> {
    const year: number =
      this.employeeVacationsService.selectedYearSignal() ||
      new Date().getFullYear();

    const employeeDecisions: VacationsApprovalInterface[] =
      this.employeeVacationsService.selectedEmployeeIdsSignal()?.map((id) => {
        const decision: VacationsApprovalInterface = { employeeId: id };
        if (this.comment) decision.comment = this.comment;
        return decision;
      });

    let success: boolean = false;

    if (!employeeDecisions?.length) return;

    this.loading = true;
    try {
      await firstValueFrom(
        this.vacationsGraphService.approveOrDiscardVacations(
          this.action === 'approve'
            ? VacationActionEnum.approve
            : VacationActionEnum.discard,
          { year },
          employeeDecisions
        )
      );
      success = true;
    } catch (e) {
      success = false;

      setTimeout((_) => {
        this.toastService.show(
          this.translatePipe.transform(
            this.action === 'approve'
              ? 'VACATIONS_APPROVE_ERROR'
              : 'VACATIONS_DECLINE_ERROR'
          ), // + ` (${e?.toast || e?.message})`
          MessageType.error
        );
      }, this.toastService.debounceTimeMs);
    } finally {
      this.loading = false;
    }

    if (success) {
      this.toastService.show(
        this.translatePipe.transform(
          this.action === 'approve'
            ? 'VACATIONS_APPROVE_SUCCESS'
            : 'VACATIONS_DECLINE_SUCCESS'
        ),
        MessageType.success
      );
      this.dialogRef.close(true);
    }

    // очищаем выбранных сотрудников перед обновлением страницы приложения
    this.employeeVacationsService.selectedEmployeeIdsSignal.set([]); // PJLKS-2967
    await this.app.refresh();
  }
}
