import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IssuesTypeListFacade } from '@features/issues/facades/issues-type-list.facade';
import { ProgressBar } from 'primeng/progressbar';
import { ScrollPositionFacade } from '@shared/features/scroll-posititon/facades/scroll-position.facade';
import {
  Preloader,
  providePreloader,
} from '@shared/services/preloader.service';
import { EmployeesSubordinatesFacade } from '../../../employees/facades/employees-subordinates.facade';
import { IssuesStatusListFacade } from '../../../issues/facades/issues-status-list.facade';
import {
  BREADCRUMB,
  provideBreadcrumb,
} from '../../../main/utils/breadcrumb-provider.utils';
import { IssuesManagementListApprovingFacade } from '../../facades/issues-management-list-approving.facade';
import { IssuesManagementListFacade } from '../../facades/issues-management-list.facade';
import { IssuesManagementFilterInterface } from '../../models/issues-management-list.interfaces';

@Component({
    selector: 'app-issues-management-container',
    templateUrl: './issues-management-list-container.component.html',
    styleUrls: ['./issues-management-list-container.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        providePreloader(ProgressBar),
        provideBreadcrumb('TITLE_ISSUES_MANAGEMENT', 0),
    ],
    standalone: false
})
export class IssuesManagementListContainerComponent implements OnInit {
  constructor(
    public issuesManagementListFacade: IssuesManagementListFacade,
    public issuesManagementListApprovingFacade: IssuesManagementListApprovingFacade,
    public issuesStatusListFacade: IssuesStatusListFacade,
    public scrollPositionFacade: ScrollPositionFacade,
    public issuesTypeListFacade: IssuesTypeListFacade,
    readonly subordinatesFacade: EmployeesSubordinatesFacade,
    private router: Router,
    private actRouter: ActivatedRoute,
    private preloader: Preloader,
    @Inject(BREADCRUMB) private _: unknown
  ) {}

  ngOnInit(): void {
    this.scrollPositionFacade.clearStore();
    this.issuesTypeListFacade.getList();

    this.preloader.setCondition(
      this.issuesManagementListFacade.forcedLoading$,
      this.issuesStatusListFacade.forcedLoading$,
      this.issuesManagementListApprovingFacade.forcedLoading$,
      this.subordinatesFacade.forcedLoading$,
      this.issuesTypeListFacade.forcedLoading$
    );

    this.subordinatesFacade.getSubordinatesList();
  }

  getIssuesManagementList(filterData?: IssuesManagementFilterInterface): void {
    if (filterData.page) {
      this.issuesManagementListFacade.getIssuesManagementList(filterData);
    }
  }

  getIssuesManagementListApproving(
    filterData?: IssuesManagementFilterInterface
  ): void {
    if (this.issuesStatusListFacade.getData()) {
      this.getListToApprove(this.issuesStatusListFacade.getData().states, filterData);
    } else {
      const statusSubscription = this.issuesStatusListFacade.getData$().subscribe((value) => {
        this.getListToApprove(value.states, filterData);
        statusSubscription.unsubscribe();
      });
    }
  }

  getListToApprove(states: any[], filterData?: IssuesManagementFilterInterface): void {
    const approveStateId = states?.find((i) => i.approve)?.id;
    if (!approveStateId) return;
    this.issuesManagementListApprovingFacade.getIssuesManagementListToApprove(
      approveStateId,
      filterData
    );
  }

  onIssueDetails(issueId: string): void {
    this.router.navigate(['', 'issues-management', issueId]).then();
  }

  saveScrollPosition(position: number): void {
    this.scrollPositionFacade.getPosition(position);
  }
}
