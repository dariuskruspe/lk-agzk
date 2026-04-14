import { Component, computed, Inject, inject, OnDestroy, OnInit, Type } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VacationsApproveDialogComponent } from 'features/vacations/components/vacations-approve-dialog/vacations-approve-dialog.component';
import { DialogService } from 'primeng/dynamicdialog';
import { ProgressBar } from 'primeng/progressbar';
import { Observable, Subject } from 'rxjs';
import { filter, skip, switchMap, take, takeUntil } from 'rxjs/operators';
import { LangFacade } from '../../../../shared/features/lang/facades/lang.facade';
import { TranslatePipe } from '../../../../shared/features/lang/pipes/lang.pipe';
import { CustomDialogService } from '../../../../shared/services/dialog.service';
import {
  Preloader,
  providePreloader,
} from '../../../../shared/services/preloader.service';
import { combineLoadings } from '../../../../shared/utilits/combine-loadings.utils';
import { MainCurrentUserFacade } from '../../../main/facades/main-current-user.facade';
import {
  BREADCRUMB,
  provideBreadcrumb,
} from '../../../main/utils/breadcrumb-provider.utils';
import { AbstractVacationsDialogComponent } from '../../components/abstract-vacation-dialog/abstract-vacations-dialog.component';
import { VacationsApprovalFacade } from '../../facades/vacations-approval.facade';
import { VacationsAvailableDaysFacade } from '../../facades/vacations-available-days.facade';
import { VacationsGraphDayOffListFacade } from '../../facades/vacations-graph-day-off-list.facade';
import { VacationsGraphEditPeriodsFacade } from '../../facades/vacations-graph-edit-periods.facade';
import { VacationsGraphPeriodsFacade } from '../../facades/vacations-graph-periods.facade';
import { VacationsGraphStatusTypesFacade } from '../../facades/vacations-graph-status-types.facade';
import { VacationsStatesFacade } from '../../facades/vacations-states.facade';
import { VacationsTypesFacade } from '../../facades/vacations-types.facade';
import {
  VacationActionEnum,
  VacationsApprovalInterface,
} from '../../models/vacations-approval.interface';
import {
  VacationPeriodInterface,
  VacationsInterface,
} from '../../models/vacations.interface';
import { GlobalSettingsStateService } from '../../../../shared/states/global-settings-state.service';

@Component({
    selector: 'app-vacations-graph-container',
    templateUrl: './vacations-graph-container.component.html',
    styleUrls: ['./vacations-graph-container.component.scss'],
    providers: [
        providePreloader(ProgressBar),
        {
            provide: DialogService,
            useClass: CustomDialogService,
        },
        provideBreadcrumb('BREADCRUMBS_VACATIONS', 0),
    ],
    standalone: false
})
export class VacationsGraphContainerComponent implements OnInit, OnDestroy {
  initYear: number;

  loading$: Observable<boolean>;

  private readonly destroy$ = new Subject<void>();

  private globalSettings = inject(GlobalSettingsStateService).state;

  isVacationsManagement = computed(() => {
    return window.location.href.includes('vacations-management');
  });

  isV2Enabled = computed(() => {
    if (this.isVacationsManagement()) {
      return this.globalSettings()?.employeesVacations?.newVersion === true;
    }
    return this.globalSettings()?.vacationSchedule?.newVersion === true;
  });

  constructor(
    public vacationsGraphDayOffListFacade: VacationsGraphDayOffListFacade,
    public vacationsGraphPeriodsFacade: VacationsGraphPeriodsFacade,
    public vacationsGraphEditPeriodsFacade: VacationsGraphEditPeriodsFacade,
    public vacationsAvailableDays: VacationsAvailableDaysFacade,
    public vacationsApprovalFacade: VacationsApprovalFacade,
    public vacationsStatusFacade: VacationsGraphStatusTypesFacade,
    public vacationsTypesFacade: VacationsTypesFacade,
    public vacationsStatesFacade: VacationsStatesFacade,
    public userFacade: MainCurrentUserFacade,
    public dialog: DialogService,
    private preloader: Preloader,
    private langFacade: LangFacade,
    private route: ActivatedRoute,
    private router: Router,
    private translatePipe: TranslatePipe,
    @Inject(BREADCRUMB) private _: unknown
  ) {}

  ngOnInit(): void {
    const year =
      +this.route.snapshot.queryParamMap.get('year') ||
      new Date().getFullYear();

    if (this.isV2Enabled()) {
      this.initYear = year;
      return;
    }

    this.loading$ = combineLoadings(
      this.vacationsGraphPeriodsFacade.loading$(),
      this.vacationsAvailableDays.loading$(),
      this.vacationsStatusFacade.loading$(),
      this.vacationsStatesFacade.loading$(),
      this.vacationsGraphEditPeriodsFacade.loading$()
    );
    this.preloader.setCondition(this.loading$);
    this.vacationsGraphPeriodsFacade.show({
      year,
    });
    this.vacationsAvailableDays.show({
      year,
    });
    this.vacationsStatusFacade.show();
    this.vacationsStatesFacade.show();
    this.initYear = year;

    this.loading$
      .pipe(
        skip(1),
        filter((v) => !v),
        take(1),
        switchMap(() => this.route.queryParams),
        takeUntil(this.destroy$)
      )
      .subscribe((params: { employeeId?: string }) => {
        if (params?.employeeId) {
          const vacation = this.vacationsGraphPeriodsFacade
            .getData()
            ?.find((v) => v.employeeId === params.employeeId);
          if (vacation) {
            this.onOpenModal({
              vacation,
              type: 'approve',
              year,
              component: VacationsApproveDialogComponent,
            });
          }
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: {
              year,
            },
          });
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  refetchData(year: number): void {
    this.vacationsGraphPeriodsFacade.show({
      year,
    });
    this.vacationsAvailableDays.show({
      year,
    });
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        year,
      },
      queryParamsHandling: 'merge',
    });
  }

  onOpenModal(event: {
    type: 'approve' | 'edit';
    component: Type<AbstractVacationsDialogComponent>;
    vacation: VacationsInterface;
    year: number;
  }): void {
    const dialogRef = this.dialog.open(event.component, {
      data: {
        ...event,
        availableDays: this.vacationsAvailableDays.getData(),
        user: this.userFacade.getData(),
        lang: this.langFacade.getLang(),
        statuses: this.vacationsStatusFacade.getData(),
        states: this.vacationsStatesFacade.getData(),
        types: this.vacationsTypesFacade.getData(),
        daysOff: this.vacationsGraphDayOffListFacade.getData(),
      },
      dismissableMask: true,
      closable: true,
      autoZIndex: false,
      header: this.translatePipe.transform(
        `VACATION_DIALOG_TITLE_${event.type}`
      ),
    });
    dialogRef.onClose.pipe(take(1)).subscribe((result) => {
      if (result && result.action) {
        this.submit(result);
      }
    });
  }

  private submit(result: {
    action: VacationActionEnum;
    year: number;
    periods?: VacationPeriodInterface[];
    employees?: VacationsApprovalInterface[];
  }): void {
    switch (result.action) {
      case VacationActionEnum.approve:
      case VacationActionEnum.discard:
        this.vacationsApprovalFacade.edit({
          param: {
            year: result.year || new Date().getFullYear(),
          },
          action: result.action,
          employees: result.employees ?? [],
        });
        break;
      case VacationActionEnum.save:
        this.vacationsGraphEditPeriodsFacade.edit({
          params: {
            year: result.year || new Date().getFullYear(),
          },
          periods: result.periods ?? [],
        });
        break;
      default:
        break;
    }
  }
}
