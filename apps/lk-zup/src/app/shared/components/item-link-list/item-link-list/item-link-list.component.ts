import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-item-link-list',
    templateUrl: './item-link-list.component.html',
    styleUrls: ['./item-link-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class ItemLinkListComponent {
  constructor(private router: Router) {}

  @Input() items: CrossPeriodsListItemInterface[];

  openIssue(issueId: string) {
    if (!issueId) return;
    this.router.navigate(['', 'issues', 'list', issueId]).then();
  }
}
export interface CrossPeriodsListItemInterface {
  type: string;
  data: {
    startDate: string;
    endDate: string;
    issueId: string;
    eventName: string;
  }[];
}
