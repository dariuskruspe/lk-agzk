import {
  Component,
  computed,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { DocumentInterface } from '@features/agreements/models/document.interface';
import { DocumentListInterface } from '@features/agreements/models/agreement.interface';
import { DocumentStatesInterface } from '@features/agreements/models/document-states.interface';
import {
  WIDGET_ISSUE_DATA_CONFIG,
  WIDGET_ISSUE_ITEM_LAYOUT,
} from '@features/dashboard/constants/issues-widget-config';
import {
  IssuesManagementInterfaces,
  IssuesManagementListInterfaces,
} from '@features/issues-management/models/issues-management-list.interfaces';
import { IssuesStatusInterface } from '@features/issues/models/issues.interface';
import { MainCurrentUserInterface } from '@features/main/models/main-current-user.interface';
import { ItemListBuilderInterface } from '@shared/components/item-list-builder/models/item-list-builder.interface';
import { SettingsThemeFacade } from '@app/shared/features/settings/facades/settings-theme.facade';

@Component({
  selector: 'app-dashboard-my-approvals',
  templateUrl: './dashboard-my-approvals.component.html',
  styleUrl: './dashboard-my-approvals.component.scss',
  standalone: false,
})
export class DashboardMyApprovalsComponent implements OnChanges {
  private settingsThemeFacade = inject(SettingsThemeFacade);

  readonly isDarkTheme = computed(() => {
    const theme = this.settingsThemeFacade.theme();
    return theme === 'dark' || theme === 'liquid-dark';
  });

  @Input() documentDataList: DocumentListInterface;

  @Input() issueDataList: IssuesManagementInterfaces;

  @Input() issueStateList: IssuesStatusInterface;

  @Input() documentStateList: DocumentStatesInterface;

  @Input() loading: boolean;

  @Input() isEnabledIssues: boolean | undefined;

  @Output() filterSignedStatus = new EventEmitter();

  @Output() loadList = new EventEmitter();

  @Output() openIssue = new EventEmitter<string>();

  @Input() currentUser: MainCurrentUserInterface;

  @Output() openDocument = new EventEmitter<DocumentInterface>();

  public issuesConfig: ItemListBuilderInterface[] = WIDGET_ISSUE_DATA_CONFIG;

  public issueLayout = WIDGET_ISSUE_ITEM_LAYOUT;

  ngOnChanges(changes: SimpleChanges): void {
    if (
      (changes?.issueStateList?.currentValue ||
        changes?.isEnabledIssues?.currentValue) &&
      this.isEnabledIssues &&
      this.issueStateList
    ) {
      this.getIssuesManagement();
    }

    if (changes?.documentStateList?.currentValue) {
      const unsignedStates = this.documentStateList.documentsStates
        .filter((e) => {
          return e.sign === false;
        })
        .map((e) => {
          return e.id;
        });
      this.filterSignedStatus.emit({
        state: unsignedStates,
        page: 1,
        count: 3,
        searchTarget: 'name',
      });
    }
  }

  getIssuesManagement() {
    const approveStates = this.issueStateList.states
      .filter((e) => {
        return e.approve === true;
      })
      .map((e) => {
        return e.id;
      });
    this.loadList.emit({
      search: '',
      state: approveStates,
      employee: '',
      days: '',
      page: 1,
      count: 3,
    });
  }

  clickIssue(issue: IssuesManagementListInterfaces): void {
    this.openIssue.emit(issue.IssueID);
  }
}
