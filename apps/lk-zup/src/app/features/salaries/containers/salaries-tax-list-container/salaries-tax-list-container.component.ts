import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { ScrollPositionFacade } from '../../../../shared/features/scroll-posititon/facades/scroll-position.facade';
import { IssuesStatusListFacade } from '../../../issues/facades/issues-status-list.facade';
import {
  BREADCRUMB,
  provideBreadcrumb,
} from '../../../main/utils/breadcrumb-provider.utils';
import { SalariesDashboardTaxFacade } from '../../facades/salaries-dashboard-tax.facade';
import { TaxListFormFilter } from '../../models/salaries-tax.interface';

@Component({
    selector: 'app-salaries-tax-list-container',
    templateUrl: './salaries-tax-list-container.component.html',
    styleUrls: ['./salaries-tax-list-container.component.scss'],
    providers: [provideBreadcrumb('TITLE_INCOME_TAX', 1)],
    standalone: false
})
export class SalariesTaxListContainerComponent {
  constructor(
    public salariesDashboardTaxFacade: SalariesDashboardTaxFacade,
    public issuesStatusListFacade: IssuesStatusListFacade,
    public scrollPositionFacade: ScrollPositionFacade,
    public router: Router,
    @Inject(BREADCRUMB) private _: unknown
  ) {}

  getIncomeTax(filterData?: TaxListFormFilter): void {
    this.salariesDashboardTaxFacade.getIncomeTax(filterData);
  }

  onIssueDetails(issueID: string): void {
    this.router.navigate(['salaries', 'tax', issueID]).then();
  }

  saveScrollPosition(position: number): void {
    this.scrollPositionFacade.getPosition(position);
  }

  onBackPage(): void {
    this.router.navigate(['', 'salaries']).then();
  }
}
