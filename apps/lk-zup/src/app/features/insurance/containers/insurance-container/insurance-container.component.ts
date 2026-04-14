import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { InsuranceCalculatorComponent } from '@features/insurance/components/insurance-calculator/insurance-calculator.component';
import { InsuranceResponse } from '@features/insurance/models/insurance.interface';
import { TranslatePipe } from '@shared/features/lang/pipes/lang.pipe';
import { LocalStorageService } from '@shared/services/local-storage.service';
import {
  Preloader,
  providePreloader,
} from '@shared/services/preloader.service';
import { DialogService } from 'primeng/dynamicdialog';
import { ProgressBar } from 'primeng/progressbar';
import { IssuesAddDialogContainerComponent } from '../../../issues/containers/issues-add-dialog-container/issues-add-dialog-container.component';
import { IssuesListFacade } from '../../../issues/facades/issues-list.facade';
import { IssuesStatusListFacade } from '../../../issues/facades/issues-status-list.facade';
import {
  BREADCRUMB,
  provideBreadcrumb,
} from '../../../main/utils/breadcrumb-provider.utils';
import { InsuranceFacade } from '../../facades/insurance-facade';
import { InsuranceIssuesFacade } from '../../facades/insurance-issues.facade';
import { IssueChangeClinicFacade } from '../../facades/issue-change-clinic.facade';

@Component({
    selector: 'app-insurance-container',
    templateUrl: './insurance-container.component.html',
    styleUrls: ['./insurance-container.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        providePreloader(ProgressBar),
        provideBreadcrumb('TITLE_MY_INSURANCE', 0),
    ],
    standalone: false
})
export class InsuranceContainerComponent implements OnInit {
  currentInsuranceType: InsuranceResponse;

  constructor(
    private preloader: Preloader,
    public insuranceFacade: InsuranceFacade,
    public insuranceIssuesFacade: InsuranceIssuesFacade,
    private localstorageService: LocalStorageService,
    public issuesListFacade: IssuesListFacade,
    public issuesStatusListFacade: IssuesStatusListFacade,
    public issueChangeClinicFacade: IssueChangeClinicFacade,
    private translatePipe: TranslatePipe,
    private dialogService: DialogService,
    private router: Router,
    @Inject(BREADCRUMB) private _: unknown
  ) {}

  ngOnInit(): void {
    this.preloader.setCondition(
      this.insuranceIssuesFacade.loading$(),
      this.insuranceFacade.loading$()
    );

    const currentEmployeeId = this.localstorageService.getCurrentEmployeeId();
    this.insuranceFacade.getInsurance(currentEmployeeId);
    this.insuranceIssuesFacade.getInsuranceIssues({
      count: 4,
      page: 1,
      useSkip: true,
    });
  }

  onIssueDetails(issueId: string): void {
    this.router.navigate(['my-insurance', 'insurance-issues', issueId]).then();
  }

  changeClinicDialog(data: { insuranceProgram: string }): void {
    const ISSUE_ALIAS = 'changeClinic';

    this.issueChangeClinicFacade.show({
      alias: ISSUE_ALIAS,
      owner: data.insuranceProgram,
    });

    this.dialogService.open(IssuesAddDialogContainerComponent, {
      width: '1065px',
      data: {
        facade: this.issueChangeClinicFacade,
        formData: data,
      },
      closable: true,
    });
  }

  deleteInsuranceDialog(data: { insuranceProgram: string }): void {
    const ISSUE_ALIAS = 'deleteInsurance';

    this.issueChangeClinicFacade.show({
      alias: ISSUE_ALIAS,
      owner: data.insuranceProgram,
    });

    this.dialogService.open(IssuesAddDialogContainerComponent, {
      width: '1065px',
      data: {
        facade: this.issueChangeClinicFacade,
        formData: data,
      },
      closable: true,
    });
  }

  openCalculator(): void {
    this.dialogService.open(InsuranceCalculatorComponent, {
      width: '700px',
      header: this.translatePipe.transform('INSURANCE_CALCULATOR_LABEL'),
      closable: true,
      data: {
        currentInsurance: this.currentInsuranceType,
      },
    });
  }

  changeInsuranceType(data: InsuranceResponse): void {
    this.currentInsuranceType = data;
  }
}
