import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { ExternalCreationComponent } from '../external-creation/external-creation.component';

@Component({
    selector: 'app-issue-creation',
    templateUrl: './issue-creation.component.html',
    styleUrls: ['./issue-creation.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class IssueCreationComponent extends ExternalCreationComponent {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(private router: Router) {
    super();
  }

  goToIssueCreation(alias?: string): void {
    this.close();
    if (alias) {
      this.router.navigate(['issues', 'types', alias, 'alias'], {
        queryParams: this.provider.ui?.userData?.reduce((acc, item) => {
          if (item?.key) {
            acc[item?.key] = item?.value;
          }
          return acc;
        }, {}),
      });
    }
  }
}
