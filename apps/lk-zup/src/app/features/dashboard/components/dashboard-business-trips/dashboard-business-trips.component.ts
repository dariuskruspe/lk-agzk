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
import { DocumentInterface } from '@features/agreements/models/document.interface';
import {
  WIDGET_BUSINESS_TRIPS_DATA_CONFIG,
  WIDGET_BUSINESS_TRIPS_ITEM_LAYOUT,
} from '@features/dashboard/constants/business-trips-widget-config';
import { DashboardBusinessTripsInterface } from '@features/dashboard/models/dashboard-business-trips.interface';
import { IssuesAddDialogContainerComponent } from '@features/issues/containers/issues-add-dialog-container/issues-add-dialog-container.component';
import { ItemListBuilderInterface } from '@shared/components/item-list-builder/models/item-list-builder.interface';
import { SettingsThemeFacade } from '@app/shared/features/settings/facades/settings-theme.facade';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-dashboard-business-trips',
  templateUrl: './dashboard-business-trips.component.html',
  styleUrls: ['./dashboard-business-trips.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class DashboardBusinessTripsComponent implements OnChanges {
  private settingsThemeFacade = inject(SettingsThemeFacade);

  readonly isDarkTheme = computed(() => {
    const theme = this.settingsThemeFacade.theme();
    return theme === 'dark' || theme === 'liquid-dark';
  });

  @Input() documentDataList: DashboardBusinessTripsInterface[];

  @Input() loading: boolean;

  @Input() isEnabled: boolean | undefined;

  @Output() openIssue = new EventEmitter<string>();

  public dataConfig: ItemListBuilderInterface[] =
    WIDGET_BUSINESS_TRIPS_DATA_CONFIG;

  public dataLayout = WIDGET_BUSINESS_TRIPS_ITEM_LAYOUT;

  constructor(public dialogService: DialogService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.documentDataList?.currentValue) {
      this.documentDataList = this.documentDataList.map((v) => ({
        ...v,
        iconName: 'icon-plane',
        button: 'Создать Авансовый отчет',
      }));
    }
  }

  onOpenDocument(issue: DashboardBusinessTripsInterface): void {
    this.openIssue.emit(issue.documentId);
  }

  openAdvanceReport(document: DashboardBusinessTripsInterface): void {
    this.openIssueAddDialog({
      id: document.linkedIssueTypeId,
      formData: { documentId: document.documentId },
    });
  }

  openIssueAddDialog(data: { id: string; formData: unknown }): void {
    this.dialogService.open(IssuesAddDialogContainerComponent, {
      width: '1065px',
      data,
      closable: true,
    });
  }
}
