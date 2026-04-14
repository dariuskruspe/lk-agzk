import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { DateClass } from '../../../../shared/features/calendar-graph/classes/date.class';
import { TranslatePipe } from '../../../../shared/features/lang/pipes/lang.pipe';
import { SettingsFacade } from '../../../../shared/features/settings/facades/settings.facade';
import { RevokeInitiator } from '../../../../shared/features/settings/models/settings.interface';
import { IssuesAddDialogContainerComponent } from '../../../issues/containers/issues-add-dialog-container/issues-add-dialog-container.component';
import { MainCurrentUserFacade } from '../../../main/facades/main-current-user.facade';
import {
  VacationsStateInterface,
  VacationsStatesInterface,
} from '../../models/vacations-states.interface';
import {
  VacationPeriodInterface,
  VacationsInterface,
} from '../../models/vacations.interface';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'vacations-info-dialog',
    templateUrl: './vacations-info-dialog.component.html',
    styleUrls: ['./vacations-info-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class VacationsInfoDialogComponent {
  info: {
    event: any;
    vacation: VacationsInterface;
    period: VacationPeriodInterface;
    states: VacationsStatesInterface;
    needReload?: boolean;
  } | null;

  @Output() closeDialog = new EventEmitter<void>();

  state: VacationsStateInterface;

  constructor(
    public date: DateClass,
    public config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private dialogService: DialogService,
    private translatePipe: TranslatePipe,
    private currentUser: MainCurrentUserFacade,
    private settingsFacade: SettingsFacade,
  ) {
    this.info = this.config.data;
    this.config.header = this.translatePipe.transform('VACATION_INFO_TITLE');
    this.state = this.info.states.states.find(
      (state) => state.id === this.info.period.stateId,
    );
  }

  close(alias: string): void {
    let modAlias = alias;
    if (
      alias === 'leaveRequestEmployee' &&
      this.info.vacation.employeeId ===
        this.currentUser.getCurrentEmployee().employeeID
    ) {
      modAlias = 'leaveRequest';
    }
    this.ref.close();
    if (alias) {
      const dialogRef = this.dialogService.open(
        IssuesAddDialogContainerComponent,
        {
          width: '1065px',
          data: {
            alias: modAlias,
            formData: {
              dateBegin: this.info?.period.startDate,
              dateEnd: this.info?.period.endDate,
              vacationDocument: this.info?.period.vacationDocument,
              vacationTypeID: this.info?.period.vacationTypeId,
              vacationRescheduled: this.info?.period.vacationRescheduled,
              issueEmployee: this.info?.vacation.employeeId,
            },
            onOtherEmployee:
              this.info.vacation.employeeId !==
              this.currentUser.getCurrentEmployee().employeeID,
          },
          closable: !this.info.needReload,
        },
      );
      dialogRef.onClose.subscribe(() => {
        if (this.info.needReload) {
          window.location.reload();
        }
      });
    }
  }

  toIssue(): void {
    this.ref.close();
  }

  isRevokeAllowed(dateEnd: string): boolean {
    const revokeInitiator =
      this.settingsFacade.getData()?.vacationSchedule.revokeFromVacation ??
      RevokeInitiator.Nobody;
    const isAllowedForCurrentUser =
      revokeInitiator !== RevokeInitiator.Nobody &&
      ((revokeInitiator === RevokeInitiator.Both &&
        (this.currentUser.getCurrentEmployee().employeeID ===
          this.info.vacation.employeeId ||
          this.info.vacation.subordinated)) ||
        (revokeInitiator === RevokeInitiator.Employee &&
          this.currentUser.getCurrentEmployee().employeeID ===
            this.info.vacation.employeeId) ||
        (revokeInitiator === RevokeInitiator.Manager &&
          this.info.vacation.subordinated &&
          this.currentUser.getCurrentEmployee().employeeID !==
            this.info.vacation.employeeId));
    return (
      new Date(dateEnd) >= new Date() &&
      !this.info.period.leaveRequest?.id &&
      !!this.info.period.vacationDocument &&
      isAllowedForCurrentUser
    );
  }
}
