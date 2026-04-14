import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { SettingsThemeFacade } from '@app/shared/features/settings/facades/settings-theme.facade';
import { ItemListBuilderInterface } from '../../../../shared/components/item-list-builder/models/item-list-builder.interface';
import { DocumentInterface } from '../../../agreements/models/document.interface';
import { DocumentListInterface } from '../../../agreements/models/agreement.interface';
import { DocumentStatesInterface } from '../../../agreements/models/document-states.interface';
import {
  IssuesManagementInterfaces,
  IssuesManagementListInterfaces,
} from '../../../issues-management/models/issues-management-list.interfaces';
import { IssuesStatusInterface } from '../../../issues/models/issues.interface';
import { MainCurrentUserInterface } from '../../../main/models/main-current-user.interface';
import {
  WIDGET_DOCUMENTS_DATA_CONFIG,
  WIDGET_DOCUMENTS_ITEM_LAYOUT,
} from '../../constants/documents-widget-config';
import {
  WIDGET_ISSUE_DATA_CONFIG,
  WIDGET_ISSUE_ITEM_LAYOUT,
} from '../../constants/issues-widget-config';

@Component({
  selector: 'app-dashboard-files',
  templateUrl: './dashboard-files.component.html',
  styleUrls: ['./dashboard-files.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class DashboardFilesComponent implements OnChanges {
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

  @Input() isEnabledDocuments: boolean | undefined;

  @Input() isEnabledIssues: boolean | undefined;

  @Output() filterSignedStatus = new EventEmitter();

  @Output() loadList = new EventEmitter();

  @Output() openIssue = new EventEmitter<string>();

  @Input() currentUser: MainCurrentUserInterface;

  @Output() openDocument = new EventEmitter<DocumentInterface>();

  public issuesConfig: ItemListBuilderInterface[] = WIDGET_ISSUE_DATA_CONFIG;

  public documentsConfig: ItemListBuilderInterface[] =
    WIDGET_DOCUMENTS_DATA_CONFIG;

  public documentsLayout = WIDGET_DOCUMENTS_ITEM_LAYOUT;

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

  clickDocument(document: DocumentInterface): void {
    this.openDocument.emit(document);
  }

  clickIssue(issue: IssuesManagementListInterfaces): void {
    this.openIssue.emit(issue.IssueID);
  }
}
