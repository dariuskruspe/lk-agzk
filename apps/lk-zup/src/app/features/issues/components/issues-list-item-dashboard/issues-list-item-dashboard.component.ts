import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { LangFacade } from '../../../../shared/features/lang/facades/lang.facade';
import { LangUtils } from '../../../../shared/features/lang/utils/lang.utils';
import {
  IssuesListInterface,
  IssuesStatusInterface,
  IssuesStatusListInterface,
} from '../../models/issues.interface';

@Component({
  selector: 'app-issues-list-item-dashboard',
  templateUrl: './issues-list-item-dashboard.component.html',
  styleUrls: ['./issues-list-item-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IssuesListItemDashboardComponent {
  issueID: string;

  @Input() dataList: IssuesListInterface;

  @Input() otherData: {
    issuesStatusList: IssuesStatusInterface;
  };

  @Output() clickItem = new EventEmitter<string>();

  constructor(public langFacade: LangFacade, public langUtils: LangUtils) {}

  logIssueDetails(id: number | string): void {
    this.issueID = id.toString();
    this.clickItem.emit(this.issueID);
  }

  issueState(state: string): IssuesStatusListInterface | null {
    return state
      ? this.otherData?.issuesStatusList?.states.find((e) => e.id === state)
      : null;
  }
}
