import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
    selector: 'app-issue-status',
    templateUrl: './issue-status.component.html',
    styleUrls: ['./issue-status.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class IssueStatusComponent {
  public title = 'ISSUE_WORK';

  public background = '#E4EDFD';

  @Input() fontColor = '#22272d';

  @Input()
  set isApproved(value: boolean | null) {
    switch (value) {
      case true:
        if (!this.title) this.title = 'ISSUE_AGREED';
        this.background = '#FCEFD5';
        break;
      case false:
        if (!this.title) this.title = 'ISSUE_REJECTION';
        this.background = '#F8D4D4';
        break;
      default:
        if (!this.title) this.title = 'ISSUE_WORK';
        this.background = '#E4EDFD';
        break;
    }
  }

  @Input() set label(value: string) {
    if (value) {
      this.title = value;
    }
  }

  @Input() set color(value: string) {
    if (value) {
      this.background = value;
    }
  }
}
