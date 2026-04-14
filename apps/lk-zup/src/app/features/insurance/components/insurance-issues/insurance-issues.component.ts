import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { ItemListBuilderInterface } from '../../../../shared/components/item-list-builder/models/item-list-builder.interface';
import { IssuesStatusInterface } from '../../../issues/models/issues.interface';
import {
  INSURANCE_ITEM_LAYOUT,
  ISSUE_INSURANCE_DATA_CONFIG,
} from '../../constants/issue-insurrance-data-config';
import {
  InsuranceIssue,
  InsuranceIssues,
} from '../../models/insurance-issues.interface';

@Component({
    selector: 'app-insurance-issues',
    templateUrl: './insurance-issues.component.html',
    styleUrls: ['./insurance-issues.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class InsuranceIssuesComponent {
  @Input() insuranceIssues: InsuranceIssues;

  @Output() goDetails = new EventEmitter();

  @Input() isIssueContainer: boolean;

  scrollContainerClassCss = '.scroll-main-container';

  public dataConfig: ItemListBuilderInterface[] = ISSUE_INSURANCE_DATA_CONFIG;

  public dataLayout = INSURANCE_ITEM_LAYOUT;

  @Input() issuesStatusList: IssuesStatusInterface;

  @Input() loading: boolean;

  onGoDetails(issue: InsuranceIssue): void {
    this.goDetails.emit(issue.issueID);
  }
}
