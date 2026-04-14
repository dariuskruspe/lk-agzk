import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CardModule } from 'primeng/card';
import { IssuesStatusListFacade } from '@app/features/issues/facades/issues-status-list.facade';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Button } from 'primeng/button';
import { keyBy, pick } from 'lodash';
import { DocumentStateFacade } from '@app/features/agreements/facades/document-state-facade.service';
import { VacationsTypesFacade } from '@app/features/vacations/facades/vacations-types.facade';
import { IssuesShowContainerComponent } from '@app/features/issues/containers/issues-show-container/issues-show-container.component';
import { DialogService } from 'primeng/dynamicdialog';
import moment from 'moment';
import { DocumentDialogContainerComponent } from '@app/features/agreements/containers/agreements-document-dialog-container/document-dialog-container.component';
import {
  DocumentInterface,
  GetDocumentParamsInterface,
} from '@app/features/agreements/models/document.interface';
import { firstValueFrom } from 'rxjs';
import { SignRoles } from '@app/shared/features/signature-file/models/sign-roles.enum';
import { DocumentApiService } from '@app/features/agreements/services/document-api.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Router, RouterLink } from '@angular/router';
import { LangModule } from '../../../../shared/features/lang/lang.module';
import { TranslatePipe } from '@app/shared/features/lang/pipes/lang.pipe';
import {
  DashboardBusinessTripTask,
  DashboardDocumentTask,
  DashboardIssueTask,
  DashboardVacationTask,
  DashboardTaskItem,
} from '../../models/dashboard.interface';
import { DashboardApiService } from '../../shared/dashboard-api.service';
import { autoaborted } from '@app/shared/utilits/autoaborted';
import { DashboardV2Service } from '../../shared/dashboard.service';
import { Preloader } from '@app/shared/services/preloader.service';
import { IWidgetComponent } from '../../shared/widget.interface';

interface TaskAction {
  label: string;
  type: string;
  variant?: 'default' | 'outlined' | 'text';
  severity?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info';
  icon?: string;
  loading?: boolean;
}

interface Task {
  id: string;
  title: string;
  status?: string;
  iconType: 'warning' | 'document';
  actions: TaskAction[];
  type: 'vacations' | 'issues' | 'documents' | 'businessTrips';
  originalItem: DashboardTaskItem;
}

@Component({
  selector: 'app-dashboard-v2-tasks-widget',
  standalone: true,
  imports: [CardModule, Button, ProgressSpinnerModule, LangModule, RouterLink],
  templateUrl: './dashboard-v2-tasks-widget.component.html',
  styleUrl: './dashboard-v2-tasks-widget.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardV2TasksWidgetComponent implements IWidgetComponent {
  // private router = inject(Router); // TODO: Использовать для навигации

  private dashboardApiService = inject(DashboardApiService);
  private dashboardService = inject(DashboardV2Service);

  tasksRequest = autoaborted();

  loading$ = this.tasksRequest.loading$;
  loading = toSignal(this.tasksRequest.loading$);

  currentPage = signal(1);
  totalPages = signal(1);

  dialogService = inject(DialogService);
  router = inject(Router);
  documentAPI = inject(DocumentApiService);

  translatePipe = inject(TranslatePipe);

  issueStateListFacade = inject(IssuesStatusListFacade);
  documentStateListFacade = inject(DocumentStateFacade);
  vacationTypesFacade = inject(VacationsTypesFacade);

  issueStateList = toSignal(this.issueStateListFacade.forcedData$);
  documentStateList = toSignal(this.documentStateListFacade.forcedData$);
  vacationTypesList = toSignal(this.vacationTypesFacade.forcedData$);

  issueStateMap = computed(() =>
    keyBy(this.issueStateList()?.states ?? [], 'id'),
  );

  documentStateMap = computed(() =>
    keyBy(this.documentStateList()?.documentsStates ?? [], 'id'),
  );

  vacationTypeMap = computed(() =>
    keyBy(this.vacationTypesList() ?? [], 'vacationTypeId'),
  );

  actionLoading = signal<[string | null, string | null]>([null, null]);

  data = signal<DashboardTaskItem[]>([]);

  tasks = computed(() =>
    this.transformTaskItems(this.data()).sort(
      (a, b) => this.taskSortWeight(b) - this.taskSortWeight(a),
    ),
  );

  constructor() {
    // Инициализация с мок-данными из JSON
    const mockData: DashboardTaskItem[] = [];

    this.data.set(mockData);
  }

  taskSortWeight = ({ originalItem }: Task): number => {
    const multiplier = 100_000_000;

    if (originalItem.type === 'vacations') {
      return 100 * multiplier + moment(originalItem.vacationBegin).unix();
    }
    if (originalItem.type === 'businessTrips') {
      return 10 * multiplier + moment(originalItem.startDate).unix();
    }
    if (originalItem.type === 'documents') {
      return 1 * multiplier + moment(originalItem.date).unix();
    }
    if (originalItem.type === 'issues') {
      return 0.5 * multiplier + moment(originalItem.date).unix();
    }
    return 0;
  };

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.tasksRequest({
      obs: this.dashboardApiService.getMyTasks(),
      next: (data) => {
        this.data.set(data.data);
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
      },
    });
  }

  private transformTaskItems(items: DashboardTaskItem[]): Task[] {
    return items.map((item) => ({
      id: this.getTaskId(item),
      title: this.formatTaskTitle(item),
      status: this.formatTaskStatus(item),
      iconType: this.getTaskIcon(item),
      actions: this.getTaskActions(item),
      type: item.type,
      originalItem: item,
    }));
  }

  private getTaskId(item: DashboardTaskItem): string {
    switch (item.type) {
      case 'vacations':
        return item.vacationTypeID;
      case 'issues':
        return item.IssueID;
      case 'documents':
        return item.id;
      case 'businessTrips':
        return item.documentId;
      default:
        return '';
    }
  }

  formatTaskTitle(item: DashboardTaskItem): string {
    switch (item.type) {
      case 'vacations': {
        const beginDate = this.formatDate(item.vacationBegin);
        const endDate = this.formatDate(item.vacationEnd);
        if (beginDate === endDate) {
          return `${this.translatePipe.transform('VACATION_TITLE_FORMAT')} ${beginDate} (${this.translatePipe.daysLabel(item.vacationDays)})`;
        }
        return `${this.translatePipe.transform('VACATION_TITLE_FORMAT')} ${beginDate} - ${endDate} (${this.translatePipe.daysLabel(item.vacationDays)})`;
      }
      case 'issues':
        return item.typeShortName || item.typeFullName;
      case 'documents':
        return item.name || item.fileName;
      case 'businessTrips': {
        const startDate = this.formatDate(item.startDate);
        const endDate = this.formatDate(item.endDate);
        return `${item.documentName}: ${startDate} - ${endDate}`;
      }
      default:
        return '';
    }
  }

  formatTaskStatus(item: DashboardTaskItem): string | undefined {
    const states = this.issueStateMap();
    const documentStates = this.documentStateMap();
    const vacationTypes = this.vacationTypeMap();

    switch (item.type) {
      case 'vacations':
        //todo: определить статус отпуска
        return vacationTypes[item.vacationTypeID]?.representation;

      case 'issues':
        return states[item.state]?.name;
      case 'documents':
        return documentStates[item.state]?.name;
      case 'businessTrips':
        return undefined;
      default:
        return undefined;
    }
  }

  getTaskIcon(item: DashboardTaskItem): 'warning' | 'document' {
    // todo: проверить логику
    switch (item.type) {
      case 'vacations':
        // Warning для неактуальных отпусков или требующих внимания
        if (!item.vacationIsActual) {
          return 'warning';
        }
        return 'document';
      case 'issues':
        // Warning для непросмотренных заявок или требующих внимания
        if (!item.viewed) {
          return 'warning';
        }
        return 'document';
      case 'documents':
        // Warning для обязательных документов или требующих срочного внимания
        if (item.mandatory) {
          return 'warning';
        }
        return 'document';
      case 'businessTrips':
        return 'document';
      default:
        return 'document';
    }
  }

  getTaskActions(item: DashboardTaskItem): TaskAction[] {
    const actions: TaskAction[] = [];
    const iconType = this.getTaskIcon(item);
    const actionLoading = this.actionLoading();
    const id = this.getTaskId(item);
    const isLoading = (type: string) =>
      actionLoading[0] === id && actionLoading[1] === type;

    switch (item.type) {
      case 'vacations':
        // если есть заявка, то только кнопка "Открыть заявку"
        if (item.issueId) {
          actions.push({
            label: this.translatePipe.transform('BUTTON_ISSUE_OPEN'),
            variant: 'outlined',
            icon: 'pi pi-arrow-right',
            type: 'vacationOpen',
          });
        } else {
          if (item.vacationReshedulingAvailable) {
            actions.push({
              label: this.translatePipe.transform('BUTTON_TRANSFER'),
              variant: 'outlined',
              type: 'vacationChangePeriod',
            });
          }
          if (item.vacationConfirmationAvailable) {
            actions.push({
              label: this.translatePipe.transform('BUTTON_CONFIRM'),
              variant: 'outlined',
              type: 'vacationConfirm',
            });
          }
        }
        break;
      case 'issues':
        // Для заявок на согласовании - кнопки "Согласовать" и "Отмена"
        if (!item.viewed && item.state) {
          actions.push(
            {
              label: this.translatePipe.transform('BUTTON_REJECT'),
              variant: 'text',
              severity: 'primary',
              type: 'issueCancel',
            },
            {
              label: this.translatePipe.transform('BUTTON_APPROVE'),
              variant: 'default',
              severity: 'primary',
              type: 'issueApprove',
            },
          );
        } else if (item.signatureEnable) {
          // Для заявок к подписанию
          actions.push({
            label: this.translatePipe.transform('BUTTON_SIGN'),
            variant: 'outlined',
            type: 'issueSign',
          });
        } else if (iconType === 'warning') {
          // Для warning задач - кнопка "Перейти"
          actions.push({
            label: this.translatePipe.transform('BUTTON_GO_TO'),
            variant: 'outlined',
            icon: 'pi pi-arrow-right',
            type: 'issueOpen',
          });
        }
        break;
      case 'documents':
        // Документы на подпись
        if (item.refuseSignatureEnabled) {
          actions.push({
            label: this.translatePipe.transform('BUTTON_REJECT'),
            variant: 'text',
            severity: 'danger',
            type: 'documentReject',
          });
        }
        if (item.mandatory || item.state) {
          actions.push({
            label: this.translatePipe.transform('BUTTON_SIGN'),
            variant: 'outlined',
            type: 'documentSign',
          });
        }
        break;
      case 'businessTrips':
        actions.push({
          label: 'Создать Авансовый отчет',
          variant: 'outlined',
          type: 'businessTripCreateReport',
        });
        break;
    }

    for (const action of actions) {
      action.loading = isLoading(action.type);
    }

    return actions;
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }

  goToPage(page: number) {
    this.currentPage.set(page);
  }

  previousPage() {
    if (this.currentPage() > 1) {
      this.currentPage.set(this.currentPage() - 1);
    }
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.set(this.currentPage() + 1);
    }
  }

  getButtonClasses(action: TaskAction): string {
    // Определяем тип кнопки на основе variant и severity
    // Primary: default + primary, или любой primary
    // Secondary: outlined + secondary, или text, или outlined + primary (для "Перейти")
    if (action.variant === 'outlined' && action.severity === 'primary') {
      // Кнопка "Перейти" - secondary стиль
      return 'dashboard-btn-action--secondary';
    }
    if (
      action.variant === 'text' ||
      (action.variant === 'outlined' && action.severity === 'secondary')
    ) {
      // Кнопка "Отмена" - secondary стиль
      return 'dashboard-btn-action--secondary';
    }
    // По умолчанию primary (Согласовать, и т.д.)
    return 'dashboard-btn-action--primary';
  }

  async handleTaskAction(task: Task, action: TaskAction) {
    if (this.actionLoading()[0]) {
      return;
    }
    console.log('Task action:', task.title, action.label);
    // TODO: Реализовать обработку действий по задачам на основе task.originalItem

    try {
      this.actionLoading.set([task.id, action.type]);
      const item = task.originalItem;

      switch (item.type) {
        case 'vacations':
          {
            const vacation = task.originalItem as DashboardVacationTask;
            const formData = {
              dateBegin: vacation.vacationBegin,
              dateEnd: vacation.vacationEnd,
              vacationRescheduled: vacation.vacationRescheduled,
              vacationTypeID: vacation.vacationTypeID,
            };

            if (action.type === 'vacationChangePeriod') {
              this.dashboardService.openIssueAddDialog({
                alias: vacation.vacationReshedulingAlias,
                formData,
              });
            }
            if (action.type === 'vacationConfirm') {
              this.dashboardService.openIssueAddDialog({
                alias: 'leave-plan',
                formData,
              });
            }
            if (action.type === 'vacationOpen') {
              this.dashboardService.openIssueShowDialog(vacation.issueId);
            }
          }
          break;
        case 'issues':
          if (action.type === 'issueCancel') {
            this.openIssue(item.IssueID, 'cancel');
          }
          if (action.type === 'issueApprove') {
            this.openIssue(item.IssueID, 'approve');
          }
          break;
        case 'documents':
          await this.openDocument(item);
          break;
        case 'businessTrips':
          if (action.type === 'businessTripCreateReport') {
            this.dashboardService.openIssueAddDialog({
              id: item.linkedIssueTypeId,
              formData: { documentId: item.documentId },
            });
          }
          break;
      }
    } catch (error) {
      console.error('Error handling task action:', error);
    } finally {
      this.actionLoading.set([null, null]);
    }
  }

  openIssue(issueId: string, action: 'cancel' | 'approve' | 'view') {
    const dialog = this.dialogService.open(IssuesShowContainerComponent, {
      width: '1065px',
      data: { issueId: issueId, action },
      closable: true,
      dismissableMask: true,
    });
    // this.updateAfterDialogNoResult(dialog, this.bufferedRequest.managerIssues);
  }

  async openDocument(doc: DashboardDocumentTask) {
    const docData = doc;
    const docParams: GetDocumentParamsInterface = pick(docData, [
      'id',
      'fileOwner',
      'forEmployee',
    ]) as GetDocumentParamsInterface;
    docParams.role = SignRoles.employee;
    const fullDoc = await firstValueFrom(
      this.documentAPI.getDocument(docParams),
    );
    const dialog = this.dialogService.open(DocumentDialogContainerComponent, {
      width: '1065px',
      data: {
        document: fullDoc,
        isShowMode: false,
      },
      closable: true,
      dismissableMask: true,
      styleClass: 'show-document',
    });
    // this.updateAfterDialog(dialog, this.bufferedRequest.documents);
  }
}
