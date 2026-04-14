import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { Observable, fromEvent } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
} from 'rxjs/operators';
import { IssuesOptionListFacade } from '../../../../shared/features/issues-option-list/facades/issues-option-list.facade';
import { LangFacade } from '../../../../shared/features/lang/facades/lang.facade';
import { OptionListFacade } from '../../../../shared/features/option-list/facades/option-list.facade';
import { SettingsFacade } from '../../../../shared/features/settings/facades/settings.facade';
import { EmployeesAdditionalStaticDataFacade } from '../../../employees/facades/employees-additional-static-data.facade';
import { EmployeesStaticDataFacade } from '../../../employees/facades/employees-static-data.facade';
import { MainCurrentUserFacade } from '../../../main/facades/main-current-user.facade';
import { BreadcrumbsService } from '../../../main/services/breadcrumbs.service';
import {
  BREADCRUMB,
  provideBreadcrumb,
} from '../../../main/utils/breadcrumb-provider.utils';
import { VacationsGraphDayOffListFacade } from '../../../vacations/facades/vacations-graph-day-off-list.facade';
import { IssuesApprovingPersonsFacade } from '../../facades/issues-approving-persons.facade';
import { IssuesCompensationIdFacade } from '../../facades/issues-compensation-id.facade';
import { IssuesCompensationFacade } from '../../facades/issues-compensation.facade';
import { IssuesDayOffFacade } from '../../facades/issues-day-off.facade';
import { IssuesTypeFacade } from '../../facades/issues-type.facade';
import { IssuesVacationBalanceDateFacade } from '../../facades/issues-vacation-balance-date.facade';
import { IssuesVacationBalanceFacade } from '../../facades/issues-vacation-balance.facade';
import { IssuesFacade } from '../../facades/issues.facade';
import { IssuesAbstractAddContainerComponent } from '../issues-abstract-add-container/issues-abstract-add-container.component';

@Component({
    selector: 'app-issues-add-static-container',
    templateUrl: './issues-add-static-container.component.html',
    styleUrls: ['./issues-add-static-container.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideBreadcrumb(IssuesTypeFacade, 2)],
    standalone: false
})
export class IssuesAddStaticContainerComponent
  extends IssuesAbstractAddContainerComponent
  implements OnInit
{
  alias: string = this.activatedRoute.snapshot.params.alias;

  isMobile$: Observable<boolean>;

  typeId: string = this.activatedRoute.snapshot.queryParams.typeId;

  isLoading = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    public issuesAddFacade: IssuesFacade,
    public dialog: DialogService,
    public issuesDayOffFacade: IssuesDayOffFacade,
    public langFacade: LangFacade,
    public currentUserFacade: MainCurrentUserFacade,
    public issuesCompensationFacade: IssuesCompensationFacade,
    public issuesVacationBalanceFacade: IssuesVacationBalanceFacade,
    public issuesVacationBalanceDateFacade: IssuesVacationBalanceDateFacade,
    public issuesCompensationIdFacade: IssuesCompensationIdFacade,
    public optionListFacade: OptionListFacade,
    public issuesOptionListFacade: IssuesOptionListFacade,
    public issuesTypeFacade: IssuesTypeFacade,
    public employeesStaticDataFacade: EmployeesStaticDataFacade,
    public settingsFacade: SettingsFacade,
    public employeesAdditionalStaticDataFacade: EmployeesAdditionalStaticDataFacade,
    protected issuesApprovingPersonsFacade: IssuesApprovingPersonsFacade,
    @Inject(BREADCRUMB) private _: unknown,
    private breadcrumbs: BreadcrumbsService,
    public daysOffFacade: VacationsGraphDayOffListFacade
  ) {
    super(
      issuesAddFacade,
      issuesTypeFacade,
      issuesApprovingPersonsFacade,
      employeesAdditionalStaticDataFacade
    );

    this.alias = this.activatedRoute?.snapshot?.params.alias;
    this.id = this.activatedRoute?.snapshot?.queryParams.typeId;
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.employeesStaticDataFacade.getStaticDataOnce();
    this.isMobile$ = fromEvent(window, 'resize').pipe(
      debounceTime(50),
      startWith(document.body.clientWidth <= 769),
      map(() => document.body.clientWidth <= 769),
      distinctUntilChanged()
    );
    this.issuesCompensationFacade.vacationBalanceByTypes();
    this.issuesVacationBalanceFacade.vacationBalance();
    this.issuesCompensationIdFacade.vacationBalanceByTypesId();
  }

  toggleDateControls(date: string): void {
    this.issuesDayOffFacade.getDaysOff(date);
  }

  showIssuesOptionLists(optionAliases: string[]): void {
    this.issuesOptionListFacade.showIssuesOptionLists(optionAliases);
  }

  goBack(): void {
    this.breadcrumbs.goBack();
  }

  get isInsurance(): boolean {
    return this.alias?.startsWith('insurance');
  }

  get isPersonnelTransfer(): boolean {
    return this.alias?.startsWith('personnelTransfer');
  }

  changeVacationBalanceByDate(date: Date): void {
    this.issuesVacationBalanceDateFacade.vacationBalanceByDate(date);
  }
}
