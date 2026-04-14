import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IssuesTypeListFacade } from '@features/issues/facades/issues-type-list.facade';
import {
  BREADCRUMB,
  provideBreadcrumb,
} from '@features/main/utils/breadcrumb-provider.utils';
import { ScrollPositionFacade } from '@shared/features/scroll-posititon/facades/scroll-position.facade';
import {
  Preloader,
  providePreloader,
} from '@shared/services/preloader.service';
import { ProgressBar } from 'primeng/progressbar';
import { MainCurrentUserFacade } from '../../../main/facades/main-current-user.facade';
import { IssuesListFacade } from '../../facades/issues-list.facade';
import { IssuesOtherEmployeeListFacade } from '../../facades/issues-other-employee-list.facade';
import { IssuesStatusListFacade } from '../../facades/issues-status-list.facade';
import { IssuesListFormFilter } from '../../models/issues.interface';

@Component({
    selector: 'app-issues-list-dashboard-container',
    templateUrl: './issues-list-dashboard-container.component.html',
    styleUrls: ['./issues-list-dashboard-container.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        providePreloader(ProgressBar),
        provideBreadcrumb('TITLE_ISSUES_LIST', 0),
    ],
    standalone: false
})
export class IssuesListDashboardContainerComponent implements OnInit {
  constructor(
    public myIssuesListFacade: IssuesListFacade,
    public issuesOtherEmployeeListFacade: IssuesOtherEmployeeListFacade,
    public issuesStatusListFacade: IssuesStatusListFacade,
    public scrollPositionFacade: ScrollPositionFacade,
    public currentUser: MainCurrentUserFacade,
    public issuesTypeListFacade: IssuesTypeListFacade,
    public router: Router,
    private preloader: Preloader,
    private activatedRoute: ActivatedRoute,
    @Inject(BREADCRUMB) private _: unknown,
  ) {}

  ngOnInit(): void {
    this.issuesTypeListFacade.getList(this.activatedRoute.snapshot.queryParams);
    this.preloader.setCondition(
      this.myIssuesListFacade.forcedLoading$,
      this.issuesOtherEmployeeListFacade.forcedLoading$,
      this.issuesStatusListFacade.forcedLoading$,
      this.issuesTypeListFacade.forcedLoading$,
    );
  }

  getList(filterData?: IssuesListFormFilter): void {
    this.myIssuesListFacade.getList(filterData);
  }

  getOtherEmployeeList(filterData?: IssuesListFormFilter): void {
    this.issuesOtherEmployeeListFacade.getList(filterData);
  }

  onIssueDetails(issueID: string): void {
    this.router.navigate(['issues', 'list', issueID]).then();
  }

  saveScrollPosition(position: number): void {
    this.scrollPositionFacade.getPosition(position);
  }
}
