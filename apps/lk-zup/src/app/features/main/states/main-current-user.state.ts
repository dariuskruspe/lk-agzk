import { Injectable, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { IssuesEmailApprovalFacade } from '@features/issues-approval/facades/issues-email-approval.facade';
import { IssuesEmailApprovalInterface } from '@features/issues-approval/models/issues-email-approval.interface';
import { MainCurrentUserInterface } from '@features/main/models/main-current-user.interface';
import { UserSettingsFacade } from '@shared/features/settings/facades/user-settings.facade';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { UserStateService } from '@shared/states/user-state.service';
import { UserService } from '@shared/services/user.service';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MainCurrentUserState {
  public entityName = 'currentUser';

  public geRxMethods: GeRxMethods = {
    exception: {
      main: () => of(this.userStateService.current()), // небольшой хак, чтобы старые модули которые использует этот стейт не сломались
      success: this.redirectAfterEmailApproval,
    },
  };

  constructor(
    private userService: UserService,
    private userStateService: UserStateService,
    @Optional() private issueEmailApprovalFacade: IssuesEmailApprovalFacade,
    private router: Router,
    public userSettingsFacade: UserSettingsFacade,
    private localstorageService: LocalStorageService
  ) {}

  redirectAfterEmailApproval(
    res: MainCurrentUserInterface,
  ): Observable<unknown> {
    const emplId = this.localstorageService.getCurrentEmployeeId();
    const hasCurrenEmployeeId =
      res.employees.findIndex((empl) => empl.employeeID === emplId) !== -1;
    if (!emplId || !hasCurrenEmployeeId) {
      this.localstorageService.setCurrentEmployeeId(
        res.employees[0].employeeID,
      );
    }
    this.userSettingsFacade.showUserSettings();
    if (this.issueEmailApprovalFacade?.getData()) {
      const issue =
        this.issueEmailApprovalFacade.getData() as IssuesEmailApprovalInterface;
      this.issueEmailApprovalFacade.delete();
      switch (true) {
        case issue?.taskType === 'vacationSchedule' &&
          !!issue?.employeeId &&
          !!issue?.year:
          return of(
            this.router.navigate(['vacations'], {
              queryParams: { employeeId: issue.employeeId, year: issue.year },
            }),
          );
        case issue?.taskType === 'issue' && !!issue?.issueId:
          return of(this.router.navigate(['issues-management', issue.issueId]));
        default:
          return of(this.router.navigate([]));
      }
    }
    return of();
  }
}
