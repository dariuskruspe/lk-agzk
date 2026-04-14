import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import { SettingsThemeFacade } from '@app/shared/features/settings/facades/settings-theme.facade';
import { ItemListBuilderInterface } from '../../../../shared/components/item-list-builder/models/item-list-builder.interface';
import {
  ISSUE_DATA_CONFIG,
  ISSUE_ITEM_LAYOUT,
} from '../../../issues/constants/issue-data-config';
import {
  IssuesInterface,
  IssuesListInterface,
  IssuesStatusInterface,
} from '../../../issues/models/issues.interface';
import { MainCurrentUserInterface } from '../../../main/models/main-current-user.interface';
import { IssueListItemSort } from '../../models/issue-list-item.interface';

@Component({
  selector: 'app-dashboard-issue',
  templateUrl: './dashboard-issue.component.html',
  styleUrls: ['./dashboard-issue.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class DashboardIssueComponent {
  private settingsThemeFacade = inject(SettingsThemeFacade);

  readonly isDarkTheme = computed(() => {
    const theme = this.settingsThemeFacade.theme();
    return theme === 'dark' || theme === 'liquid-dark';
  });

  issuesSort: IssueListItemSort = {};

  @Input() currentUser: MainCurrentUserInterface;

  object = Object;

  issuesViewToggle = false;

  @Input() issueList: IssuesListInterface;

  @Input() issuesStatusList: IssuesStatusInterface;

  @Input() loading: boolean;

  @Input() isEnabled: boolean | undefined;

  @Output() openIssue = new EventEmitter<string>();

  public dataConfig: ItemListBuilderInterface[] = ISSUE_DATA_CONFIG;

  public dataLayout = ISSUE_ITEM_LAYOUT;

  onOpenIssues(issue: IssuesInterface): void {
    this.openIssue.emit(issue.IssueID);
  }

  onIssuesViewToggle(): void {
    this.issuesViewToggle = !this.issuesViewToggle;
  }
}
