import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { ProgressBar } from 'primeng/progressbar';
import { LangFacade } from '../../../../shared/features/lang/facades/lang.facade';
import { SettingsFacade } from '../../../../shared/features/settings/facades/settings.facade';
import {
  Preloader,
  providePreloader,
} from '../../../../shared/services/preloader.service';
import { EmployeesAdditionalStaticDataFacade } from '../../../employees/facades/employees-additional-static-data.facade';
import { EmployeesStaticDataFacade } from '../../../employees/facades/employees-static-data.facade';
import { MainCurrentUserFacade } from '../../../main/facades/main-current-user.facade';
import { BreadcrumbsService } from '../../../main/services/breadcrumbs.service';
import {
  BREADCRUMB,
  provideBreadcrumb,
} from '../../../main/utils/breadcrumb-provider.utils';
import { IssuesApprovingPersonsFacade } from '../../facades/issues-approving-persons.facade';
import { IssuesTypeFacade } from '../../facades/issues-type.facade';
import { IssuesFacade } from '../../facades/issues.facade';
import { IssuesAbstractAddContainerComponent } from '../issues-abstract-add-container/issues-abstract-add-container.component';
import { IssuesVacationBalanceFacade } from '@features/issues/facades/issues-vacation-balance.facade';

@Component({
    selector: 'app-issues-add-container',
    templateUrl: './issues-add-container.component.html',
    styleUrls: ['./issues-add-container.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        providePreloader(ProgressBar),
        provideBreadcrumb(IssuesTypeFacade, 2),
    ],
    standalone: false
})
export class IssuesAddContainerComponent
  extends IssuesAbstractAddContainerComponent
  implements OnInit
{
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public dialog: DialogService,
    public settingsFacade: SettingsFacade,
    public currentUserFacade: MainCurrentUserFacade,
    public issuesAddFacade: IssuesFacade,
    public issuesTypeFacade: IssuesTypeFacade,
    public employeesStaticDataFacade: EmployeesStaticDataFacade,
    public employeesAdditionalStaticDataFacade: EmployeesAdditionalStaticDataFacade,
    public issuesApprovingPersonsFacade: IssuesApprovingPersonsFacade,
    public langFacade: LangFacade,
    private dialogService: DialogService,
    private preloader: Preloader,
    @Inject(BREADCRUMB) private _: unknown,
    private breadcrumbs: BreadcrumbsService,
    public issuesVacationBalanceFacade: IssuesVacationBalanceFacade,
  ) {
    super(
      issuesAddFacade,
      issuesTypeFacade,
      issuesApprovingPersonsFacade,
      employeesAdditionalStaticDataFacade,
    );

    this.id = this.activatedRoute?.snapshot?.params.id;
    this.alias = this.activatedRoute?.snapshot?.params.alias;

    this.preloader.setCondition(
      this.issuesTypeFacade.forcedLoading$ ||
        this.issuesAddFacade.forcedLoading$ ||
        this.issuesApprovingPersonsFacade.forcedLoading$,
    );
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.employeesStaticDataFacade.getStaticDataOnce();
  }

  backPage(): void {
    this.breadcrumbs.goBack();
  }
}
