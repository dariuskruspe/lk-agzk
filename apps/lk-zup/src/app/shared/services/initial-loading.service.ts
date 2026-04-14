import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, filter, map, take } from 'rxjs/operators';
import { DocumentStateFacade } from '@features/agreements/facades/document-state-facade.service';
import { DashboardCurrentStateFacade } from '../../features/dashboard/facades/dashboard-current-state.facade';
import { DashboardPopularRequestsFacade } from '../../features/dashboard/facades/dashboard-popular-requests.facade';
import { DashboardVacationReportsFacade } from '../../features/dashboard/facades/dashboard-vacation-reports.facade';
import { DashboardVacationTotalFacade } from '../../features/dashboard/facades/dashboard-vacation-total.facade';
import { DashboardVacationFacade } from '../../features/dashboard/facades/dashboard-vacation.facade';
import { DashboardWorkPeriodFacade } from '../../features/dashboard/facades/dashboard-work-period.facade';
import { EmployeesStateListFacade } from '../../features/employees/facades/employees-state-list.facade';
import { IssuesManagementListFacade } from '../../features/issues-management/facades/issues-management-list.facade';
import { IssuesListFacade } from '../../features/issues/facades/issues-list.facade';
import { IssuesStatusListFacade } from '../../features/issues/facades/issues-status-list.facade';
import { MainCurrentUserFacade } from '../../features/main/facades/main-current-user.facade';
import { VacationsTypesFacade } from '../../features/vacations/facades/vacations-types.facade';
import { SettingsFacade } from '../features/settings/facades/settings.facade';
import { ProvidersFacade } from '../features/signature-validation-form/facades/providers.facade';
import { combineLoadings } from '../utilits/combine-loadings.utils';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable()
export class InitialLoadingService {
  private loading = new BehaviorSubject(true);

  private welcome = new BehaviorSubject(false);

  private isNewSession = false;

  isLoadingSignal = toSignal(this.loading);

  constructor(
    private settingsFacade: SettingsFacade,
    private currentUser: MainCurrentUserFacade,
    private providersFacade: ProvidersFacade,
    private currentStateFacade: DashboardCurrentStateFacade,
    private popularRequestsFacade: DashboardPopularRequestsFacade,
    private issuesListFacade: IssuesListFacade,
    private issuesStatusListFacade: IssuesStatusListFacade,
    private issuesManagementListFacade: IssuesManagementListFacade,
    private vacationTotalFacade: DashboardVacationTotalFacade,
    private workPeriodFacade: DashboardWorkPeriodFacade,
    private vacationReportsFacade: DashboardVacationReportsFacade,
    private vacationFacade: DashboardVacationFacade,
    private agreementDocumentStateFacade: DocumentStateFacade,
    private vacationTypesFacade: VacationsTypesFacade,
    private employeeStateListFacade: EmployeesStateListFacade,
    private router: Router,
  ) {}

  init(): void {
    this.loading.next(true);
    combineLoadings(
      this.settingsFacade.forcedLoading$,
      this.currentUser.forcedLoading$,
      this.providersFacade.forcedLoading$,
      this.currentStateFacade.forcedLoading$,
      this.popularRequestsFacade.forcedLoading$,
      this.issuesListFacade.forcedLoading$,
      this.issuesStatusListFacade.forcedLoading$,
      this.issuesManagementListFacade.forcedLoading$,
      this.vacationTotalFacade.forcedLoading$,
      this.workPeriodFacade.forcedLoading$,
      this.vacationReportsFacade.forcedLoading$,
      this.vacationFacade.forcedLoading$,
      this.agreementDocumentStateFacade.forcedLoading$,
      this.vacationTypesFacade.forcedLoading$,
      this.employeeStateListFacade.forcedLoading$,
    )
      .pipe(
        debounceTime(300),
        filter((v) => !v),
        take(1),
      )
      .subscribe(() => {
        this.loading.next(false);
      });
  }

  isLoading$(): Observable<boolean> {
    return this.loading.asObservable();
  }

  isWelcome$(): Observable<boolean> {
    return this.welcome.asObservable();
  }

  setWelcomeStatus(status: boolean): void {
    this.isNewSession = status;
  }

  initWelcomeStatus(): void {
    if (this.isNewSession) {
      const defaultUrl = this.router.url?.split('?')?.[0];
      this.welcome.next(true);
      this.router.events
        .pipe(
          filter((e) => e instanceof NavigationEnd),
          map((e: NavigationEnd) => e.url?.split('?')?.[0]),
          filter((url) => url !== defaultUrl),
          take(1),
        )
        .subscribe(() => {
          this.welcome.next(false);
        });
    }
  }
}
