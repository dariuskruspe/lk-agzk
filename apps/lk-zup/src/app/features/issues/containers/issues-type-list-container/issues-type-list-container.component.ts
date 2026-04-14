import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgressBar } from 'primeng/progressbar';
import { Subject } from 'rxjs';
import {
  Preloader,
  providePreloader,
} from '../../../../shared/services/preloader.service';
import { BreadcrumbsService } from '../../../main/services/breadcrumbs.service';
import {
  BREADCRUMB,
  provideBreadcrumb,
} from '../../../main/utils/breadcrumb-provider.utils';
import { IssuesTypeListFacade } from '../../facades/issues-type-list.facade';
import { IssuesTypesInterface } from '../../models/issues-types.interface';

@Component({
    selector: 'app-issues-type-list-container',
    templateUrl: './issues-type-list-container.component.html',
    styleUrls: ['./issues-type-list-container.component.scss'],
    providers: [
        providePreloader(ProgressBar),
        provideBreadcrumb('BREADCRUMBS_ISSUE_TYPE_SELECT', 1),
    ],
    standalone: false
})
export class IssuesTypeListContainerComponent implements OnInit {
  filterIssuesTypeList$ = new Subject<IssuesTypesInterface>();

  constructor(
    public issuesTypeListFacade: IssuesTypeListFacade,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private preloader: Preloader,
    @Inject(BREADCRUMB) private _: unknown,
    private breadcrumbs: BreadcrumbsService
  ) {
    this.preloader.setCondition(this.issuesTypeListFacade.loading$());
  }

  ngOnInit(): void {
    this.issuesTypeListFacade.getList(this.activatedRoute.snapshot.queryParams);
  }

  onFilterIssuesTypeList(value: string): void {
    const filterIssuesTypeList: IssuesTypesInterface = {};
    filterIssuesTypeList.issueTypeGroups = [];
    for (const issueTypeGroup of this.issuesTypeListFacade.getData()
      .issueTypeGroups) {
      const tmp = { ...issueTypeGroup };
      tmp.issueTypes = value
        ? tmp.issueTypes.filter(
            (el) =>
              // HRM-39179
              // el.issueTypeFullName
              //   .toLocaleLowerCase()
              //   .indexOf(value.toLocaleLowerCase()) > -1 ||
              el.issueTypeShortName
                .toLocaleLowerCase()
                .indexOf(value.toLocaleLowerCase()) > -1
          )
        : tmp.issueTypes;
      filterIssuesTypeList.issueTypeGroups.push(tmp);
    }
    this.filterIssuesTypeList$.next(filterIssuesTypeList);
  }

  backPage(): void {
    this.breadcrumbs.goBack();
  }
}
