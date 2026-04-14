import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { IssueTypes } from '../../../issues/models/issues-types.interface';
import { DashboardPopularRequestsInterface } from '../../models/dashboard-popular-requests.interface';

@Component({
    selector: 'app-dashboard-popular-requests',
    templateUrl: './dashboard-popular-requests.component.html',
    styleUrls: ['./dashboard-popular-requests.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class DashboardPopularRequestsComponent {
  @Input() popularRequests: DashboardPopularRequestsInterface;

  @Output() getIssueId = new EventEmitter();

  @Input() isEnabled: boolean | undefined;

  constructor(private router: Router) {}

  issueShowRouting(issueType: IssueTypes): void {
    if (issueType.useAsCustomTemplate) {
      this.goToCustomIssueAlias(
        issueType.issueTypeAlias,
        issueType.issueTypeID
      );
    } else {
      this.goToIssue(issueType.issueTypeID);
    }
  }

  goToIssue(id: string): void {
    this.router.navigate(['', 'issues', 'types', id]).then();
  }

  goToCustomIssueAlias(alias: string, typeId: string): void {
    this.router
      .navigate(['', 'issues', 'types', alias, 'custom'], {
        queryParams: { typeId },
      })
      .then();
  }
}
