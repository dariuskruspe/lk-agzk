import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { ProgressBar } from 'primeng/progressbar';
import { LocalStorageService } from '@shared/services/local-storage.service';
import {
  Preloader,
  providePreloader,
} from '../../../../shared/services/preloader.service';
import { IssuesListFacade } from '../../../issues/facades/issues-list.facade';
import { IssuesStatusListFacade } from '../../../issues/facades/issues-status-list.facade';
import {
  BREADCRUMB,
  provideBreadcrumb,
} from '../../../main/utils/breadcrumb-provider.utils';
import { InsuranceFacade } from '../../facades/insurance-facade';
import { InsuranceIssuesFacade } from '../../facades/insurance-issues.facade';

@Component({
    selector: 'app-insurance-issues-container',
    templateUrl: './insurance-issues-container.component.html',
    styleUrls: ['./insurance-issues-container.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        providePreloader(ProgressBar),
        provideBreadcrumb('TITLE_MY_INSURANCE', 1),
    ],
    standalone: false
})
export class InsuranceIssuesContainerComponent implements OnInit {
  constructor(
    @Inject(BREADCRUMB) private _: unknown,
    private preloader: Preloader,
    public insuranceFacade: InsuranceFacade,
    private router: Router,
    public insuranceIssuesFacade: InsuranceIssuesFacade,
    private localstorageService: LocalStorageService,
    public issuesListFacade: IssuesListFacade,
    public issuesStatusListFacade: IssuesStatusListFacade
  ) {}

  ngOnInit(): void {
    this.preloader.setCondition(
      this.insuranceIssuesFacade.loading$(),
      this.insuranceFacade.loading$()
    );

    const currentEmployeeId = this.localstorageService.getCurrentEmployeeId();
    this.insuranceFacade.getInsurance(currentEmployeeId);
    this.insuranceIssuesFacade.getInsuranceIssues();
  }

  onIssueDetails(issueId: string): void {
    this.router.navigate(['my-insurance', 'insurance-issues', issueId]).then();
  }
}
