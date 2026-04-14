import {
  Component,
  computed,
  DestroyRef,
  inject,
  Inject,
  OnInit,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { BusinessTripsIssuesListFacade } from '@features/business-trips/facades/business-trips-issues-list.facade';
import { BusinessTripsMembersFacade } from '@features/business-trips/facades/business-trips-members.facade';
import { BusinessTripsTimesheetFacade } from '@features/business-trips/facades/business-trips-timesheet.facade';
import { IssuesStatusListFacade } from '@features/issues/facades/issues-status-list.facade';
import { IssuesTypeListFacade } from '@features/issues/facades/issues-type-list.facade';
import { IssuesListFormFilter } from '@features/issues/models/issues.interface';
import { MainCurrentUserFacade } from '@features/main/facades/main-current-user.facade';
import {
  BREADCRUMB,
  provideBreadcrumb,
} from '@features/main/utils/breadcrumb-provider.utils';
import { VacationsGraphStatusTypesFacade } from '@features/vacations/facades/vacations-graph-status-types.facade';
import { ScrollPositionFacade } from '@shared/features/scroll-posititon/facades/scroll-position.facade';
import { SettingsInterface } from '@shared/features/settings/models/settings.interface';
import { UserSettingsInterface } from '@shared/models/menu-condition.interface';
import { AppService } from '@shared/services/app.service';
import {
  Preloader,
  providePreloader,
} from '@shared/services/preloader.service';
import { ProgressBar } from 'primeng/progressbar';
import { firstValueFrom, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-business-trips-list-dashboard-container',
    templateUrl: './business-trips-list-dashboard-container.component.html',
    styleUrls: ['./business-trips-list-dashboard-container.component.scss'],
    providers: [
        providePreloader(ProgressBar),
        provideBreadcrumb('TITLE_BUSINESS_TRIPS', 0),
    ],
    standalone: false
})
export class BusinessTripsDashboardContainerComponent implements OnInit {
  app: AppService = inject(AppService);

  destroyRef: DestroyRef = inject(DestroyRef);

  settingsSignal: WritableSignal<SettingsInterface> =
    this.app.storage.settings.data.frontend.signal.globalSettings;

  settings$: Observable<SettingsInterface> = toObservable(
    this.settingsSignal
  ).pipe(
    filter((v: SettingsInterface) => !!v),
    takeUntilDestroyed(this.destroyRef)
  );

  userSettingsSignal: WritableSignal<UserSettingsInterface> =
    this.app.userSettingsSignal;

  userSettings$: Observable<UserSettingsInterface> = toObservable(
    this.userSettingsSignal
  ).pipe(
    filter((v: UserSettingsInterface) => !!v),
    takeUntilDestroyed(this.destroyRef)
  );

  sectionId: 'employeeBusinessTrips' | 'businessTrips';

  isEmployeeBusinessTrips = computed(() => {
    return window.location.href.includes('employee');
  });

  isV2Enabled = computed(() => {
    const settings = this.settingsSignal();

    if (!settings) {
      return false;
    }

    if (this.isEmployeeBusinessTrips()) {
      return settings.employeeBusinessTrips?.newVersion === true;
    }

    return settings.businessTrips?.newVersion === true;
  });

  constructor(
    public businessTripsIssuesListFacade: BusinessTripsIssuesListFacade,
    public issuesStatusListFacade: IssuesStatusListFacade,
    public issuesTypeListFacade: IssuesTypeListFacade,
    public businessTripsTimesheetFacade: BusinessTripsTimesheetFacade,
    public businessTripsMembersFacade: BusinessTripsMembersFacade,
    public scrollPositionFacade: ScrollPositionFacade,
    public router: Router,
    public preloader: Preloader,
    private activatedRoute: ActivatedRoute,
    public vacationsStatusFacade: VacationsGraphStatusTypesFacade,
    public userFacade: MainCurrentUserFacade,
    @Inject(BREADCRUMB) private _: unknown
  ) {}

  async ngOnInit(): Promise<void> {
    await Promise.all([
      firstValueFrom(this.settings$),
      firstValueFrom(this.userSettings$),
    ]);

    if (this.shouldUseV2()) {
      return;
    }

    this.preloader.setCondition(
      this.businessTripsIssuesListFacade.loading$(),
      this.issuesStatusListFacade.loading$(),
      this.vacationsStatusFacade.loading$(),
      this.businessTripsTimesheetFacade.loading$()
    );

    const settings: SettingsInterface = this.settingsSignal();
    const userSettings: UserSettingsInterface = this.userSettingsSignal();

    if (
      settings.businessTrips.businessTripsIssues.enable &&
      userSettings.businessTrips.businessTripsIssues.enable
    ) {
      this.issuesTypeListFacade.getList(
        this.activatedRoute.snapshot.queryParams
      );
    }
    this.vacationsStatusFacade.show();
    this.sectionId = window.location.href.includes('employee')
      ? 'employeeBusinessTrips'
      : 'businessTrips';
    const yearFromUrl = +this.activatedRoute.snapshot.queryParams['year'] || new Date().getFullYear();
    this.businessTripsTimesheetFacade.getTimesheet({
      dateBegin: new Date(
        Date.UTC(yearFromUrl, 0, 1)
      ).toISOString(),
      dateEnd: new Date(
        Date.UTC(yearFromUrl, 11, 31)
      ).toISOString(),
      sectionId: this.sectionId,
    });
    this.businessTripsMembersFacade.getMembers(this.sectionId);
  }

  getList(filterData?: IssuesListFormFilter): void {
    this.businessTripsIssuesListFacade.getList(filterData);
  }

  onIssueDetails(businessTripID: string): void {
    this.router.navigate(['business-trip', businessTripID]).then();
  }

  toBusinessTripCreation(): void {
    const { issueIdCreate } = this.vacationsStatusFacade
      .getData()
      .find(
        (type) => type.showGroup.includes('businessTrips') && type.issueIdCreate
      );
    this.router.navigate(['', 'issues', 'types', issueIdCreate]);
  }

  saveScrollPosition(position: number): void {
    this.scrollPositionFacade.getPosition(position);
  }

  changeYear(year: number) {
    this.businessTripsTimesheetFacade.getTimesheet({
      dateBegin: new Date(Date.UTC(year, 0, 1)).toISOString(),
      dateEnd: new Date(Date.UTC(year, 11, 31)).toISOString(),
      sectionId: this.sectionId,
    });
    this.router.navigate([], { queryParams: { year: year }, queryParamsHandling: 'merge' });
  }

  private shouldUseV2(): boolean {
    const settings = this.settingsSignal();

    if (!settings) {
      return false;
    }

    if (this.isEmployeeBusinessTrips()) {
      return settings.employeeBusinessTrips?.newVersion === true;
    }

    return settings.businessTrips?.newVersion === true;
  }
}
