import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IssueApproveInterfaceError,
  IssueApproveInterfaceSuccess,
} from '@features/issues-approval/models/issue-approve.interface';
import { DocumentStatesInterface } from '@features/agreements/models/document-states.interface';
import { IssuesAddInterface } from '@features/issues/models/issues-add.interface';
import { IssuesDocSignInterface } from '@features/issues/models/issues-doc-sign.interface';
import { IssuesHistoryInterface } from '@features/issues/models/issues-history.interface';
import { IssuesStatusItemInterface } from '@features/issues/models/issues-status-item.interface';
import {
  IssuesJoinInterface,
  IssuesStatusInterface,
  IssuesStatusListInterface,
} from '@features/issues/models/issues.interface';
import { IssuesEmployeeNameUtils } from '@features/issues/utils/issues-employee-name.utils';
import { ItemListBuilderInterface } from '@shared/components/item-list-builder/models/item-list-builder.interface';
import {
  WIDGET_DOCUMENTS_DATA_CONFIG,
  WIDGET_DOCUMENTS_ITEM_LAYOUT,
} from '@features/dashboard/constants/documents-widget-config';
import { MainCurrentUserFacade } from '@features/main/facades/main-current-user.facade';
import { IssuesCancelModalComponent } from '@shared/components/issues-cancel-modal/issues-cancel-modal.component';
import { ItemListInterface } from '@shared/components/item-list/models/item-list.interface';
import { StepsComponent } from '@shared/components/steps/steps.component';
import { LangFacade } from '@shared/features/lang/facades/lang.facade';
import { LangUtils } from '@shared/features/lang/utils/lang.utils';
import { StepsOptionsInterface } from '@shared/interfaces/steps/options/steps-options.interface';
import { StepOptionsInterface } from '@shared/interfaces/steps/options/template/common/step-options.interface';
import { StepInterface } from '@shared/interfaces/steps/step.interface';
import { FileBase64 } from '@shared/models/files.interface';
import { AppService } from '@shared/services/app.service';
import { FpcInterface } from '@wafpc/base/models/fpc.interface';
import { DialogService } from 'primeng/dynamicdialog';
import { Observable, Subject } from 'rxjs';
import { TranslatePipe } from '@shared/features/lang/pipes/lang.pipe';
import { IssuesCopyAttachmentDialogComponent } from '../issues-copy-attachment-dialog/issues-copy-attachment-dialog.component';

@Component({
    selector: 'app-issues-show',
    templateUrl: './issues-show.component.html',
    styleUrls: ['./issues-show.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class IssuesShowComponent implements OnChanges, OnInit {
  app = inject(AppService);

  screenSize = this.app.storage.screen.data.frontend.size;

  isMobileV = this.screenSize.signal.isMobileV;

  fpcData: FpcInterface = {};

  moddedData = new Subject<FpcInterface>();

  issueState: IssuesStatusListInterface;

  staticData: ItemListInterface[] = [];

  cancelDisabledForThisIssueType = false;

  documentsDataConfig: ItemListBuilderInterface[] = WIDGET_DOCUMENTS_DATA_CONFIG;

  documentsDataLayout = WIDGET_DOCUMENTS_ITEM_LAYOUT;

  /**
   * Комментарий при отклонении заявки.
   */
  cancelComment: string = '';

  @Input() issueID: string;

  @Input() isRequiringApproval: boolean;

  @Input() issueJoinData: IssuesJoinInterface;

  @Input() isItDialog: boolean;

  @Input() approvalStatus:
    | IssueApproveInterfaceSuccess
    | IssueApproveInterfaceError;

  @Input() fileBase64: string | FileBase64 | null;

  @Input() issuesStatusList: IssuesStatusInterface;

  @Input() dashboard: boolean;

  @Input() issuesHistory: IssuesHistoryInterface;

  @Input() issuesCancelAccess: boolean;

  @Input() employeesStaticData: IssuesAddInterface;

  @Input() issueSteps: IssuesStatusItemInterface[] = [];

  @Input() docSignList: IssuesDocSignInterface[];

  @Input() docSignStateList: DocumentStatesInterface;

  @Input() docSignLoading: boolean;

  @Input() docSignDownloading: boolean;

  @Input() isDraft: boolean;

  @Input() syncTabWithQueryParams = true;

  @Output() issueCancel = new EventEmitter();

  @Output() docOnClick = new EventEmitter<IssuesDocSignInterface>();

  @Output() downloadArch = new EventEmitter();

  @Output() getFile = new EventEmitter();

  @Output() backPage = new EventEmitter<void>();

  @Output() closeDialog = new EventEmitter<void>();

  @Output() openedHistory = new EventEmitter<boolean>();

  activeTabIndex = 0;

  constructor(
    public langUtils: LangUtils,
    public currentUserFacade: MainCurrentUserFacade,
    public langFacade: LangFacade,
    public dialogService: DialogService,
    private ref: ChangeDetectorRef,
    private issuesEmployeeNameUtils: IssuesEmployeeNameUtils,
    private router: Router,
    private translatePipe: TranslatePipe,
    private route: ActivatedRoute,
  ) {}

  get moddedData$(): Observable<FpcInterface> {
    return this.moddedData.asObservable();
  }

  ngOnInit() {
    const { tab } = this.route.snapshot.queryParams;
    if (tab) {
      this.activeTabIndex = this.getTabIndexByName(tab);
    } else if (this.syncTabWithQueryParams) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {
          tab: this.getTabNameByIndex(this.activeTabIndex),
        },
        queryParamsHandling: 'merge',
      });
    }
  }

  private getTabIndexByName(tabName: string): number {
    switch (tabName) {
      case 'issue':
        return 0;
      case 'documents':
        return 1;
      case 'history':
        return 2;
      default:
        return 0;
    }
  }

  private getTabNameByIndex(index: number): string {
    switch (index) {
      case 0:
        return 'issue';
      case 1:
        return 'documents';
      case 2:
        return 'history';
      default:
        return 'issue';
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.issueJoinData?.currentValue) {
      this.cancelDisabledForThisIssueType =
        this.issueJoinData.issueType?.cancelDisable;

      this.fpcData = Object.assign(
        this.fpcData,
        changes?.issueJoinData?.currentValue?.issueType,
      );
      if (changes?.issueJoinData?.currentValue?.issue?.formData) {
        this.fpcData.data = changes.issueJoinData.currentValue.issue.formData;
      }
      this.fpcData.options = Object.assign(this.fpcData.options || {}, {
        changeStrategy: 'push',
        appearanceElements: 'outline',
        editMode: false,
        viewMode: 'show',
      });
      if (
        (changes?.issueJoinData?.currentValue?.issue?.formData?.isOrder &&
          changes?.issueJoinData?.currentValue?.issue?.userID !==
            this.currentUserFacade.getData().userID &&
          changes?.issueJoinData?.currentValue?.issueType
            ?.templateOnOtherEmployees) ||
        (!changes?.issueJoinData?.currentValue?.issueType?.template &&
          changes?.issueJoinData?.currentValue?.issueType
            ?.templateOnOtherEmployees)
      ) {
        this.fpcData.template = this.fpcData?.templateOnOtherEmployees;
      }
      this.moddedData.next(this.fpcData);
      if (this.issueSteps) {
        this.issueSteps = this.issueSteps.map((step, index) => {
          return {
            ...step,
            active: index + 1 === this.issueJoinData.issue.stateOrder,
          }
        });
      }
    }
    if (this.issueJoinData && this.issuesStatusList) {
      this.getIssueState(this.issueJoinData?.issue?.state);
    }
    if (changes.employeesStaticData?.currentValue && this.fpcData) {
      this.fpcData?.options?.staticInfo?.forEach((data) => {
        if (this.employeesStaticData[data]) {
          this.staticData.push({
            title: this.employeesStaticData[data].name,
            value: this.issuesEmployeeNameUtils.getValue(
              data,
              this.employeesStaticData[data].value,
            ),
          });
        }
      });
    }

    if (changes.issueSteps?.currentValue?.length) {
      if (this.issueJoinData?.issue) {
        this.issueSteps = this.issueSteps.map((step, index) => {
          return {
            ...step,
            active: index + 1 === this.issueJoinData.issue.stateOrder,
          }
        });
      }
    }

    if (
      changes.docSignList?.currentValue?.length &&
      this.isDraft &&
      this.docSignStateList
    ) {
      this.tryAutoOpenSignatureDocument();
    }

    this.ref.detectChanges();
  }

  isManagerIssue(): boolean {
    return window.location.href.includes('issues-management');
  }

  onBackPage(): void {
    this.backPage.emit();
  }

  getFileOut(id: number | string): void {
    this.getFile.emit(id);
  }

  getIssueState(state: string): void {
    this.issueState =
      this.issuesStatusList?.states.find((e) => e.id === state) || null;
  }

  getIssueHistoryState(state: string): IssuesStatusListInterface {
    return this.issuesStatusList?.states.find((e) => e.id === state) || null;
  }

  onIssueCancelMobile(): void {
    // без диалогового окна
    const comment: string = this.cancelComment;
    if (!comment) return;
    this.issueCancel.emit({ comment });
  }

  onIssueCancel(): void {
    const dialogRef = this.dialogService.open(IssuesCancelModalComponent, {
      width: '1065px',
      closable: true,
      // showHeader: true,
      // header: this.langUtils.convert(
      //   this.langFacade.getLang(),
      //   'ISSUES_CANCEL_MODAL_HEADER'
      // ),
    });

    dialogRef.onClose.subscribe((result) => {
      if (result) {
        this.issueCancel.emit(result);
      }
    });
  }

  changedTab(tab: { index: number }): void {
    this.activeTabIndex = tab.index;

    if (this.syncTabWithQueryParams) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {
          tab: this.getTabNameByIndex(tab.index),
        },
        queryParamsHandling: 'merge',
      });
    }

    this.openedHistory.emit(tab.index === 2);
  }

  openSignature(doc: IssuesDocSignInterface): void {
    this.docOnClick.emit(doc);
  }

  private tryAutoOpenSignatureDocument(): void {
    const needToSign = this.docSignList.find(
      (doc) =>
        this.docSignStateList.documentsStates.find(
          (state) => state.id === doc.state
        )?.sign === false
    );
    if (needToSign) {
      this.openSignature(needToSign);
    } else if (this.syncTabWithQueryParams) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {},
      });
    }
  }

  onDownloadArch(): void {
    this.downloadArch.emit();
  }

  createReportIssue(typeId: string, documentId: string) {
    this.router
      .navigate(['', 'issues', 'types', typeId], {
        queryParams: { documentId },
      })
      .then();
    this.closeDialog.emit();
  }

  toReportIssue(issueId: string) {
    this.router.navigate(['', 'issues', 'list', issueId]).then();
    this.closeDialog.emit();
  }

  /**
   * Отображаем все этапы заявки в виде шагов в диалоговом окне.
   */
  showSteps() {
    const steps: StepInterface[] = this.issueSteps;

    const currentTemplate = 'timeline';
    const layout: 'vertical' | 'horizontal' = 'vertical';
    const iconSize: string = '0px';

    const stepOptions: StepOptionsInterface = {
      timeline: {
        style: {
          minWidth: '22px',
        },
      },
      marker: {
        style: { padding: '4px' },
        icon: {
          style: {
            width: `${iconSize}`,
            height: `${iconSize}`,
            fontSize: `${iconSize}`,
          },
        },
      },
      label: {
        style: {
          border: 'none',
          borderWidth: 'medium',
          borderStyle: 'none',
          borderColor: 'currentcolor',
          padding: '0',
          width: 'fit-content',
          height: 'auto',
          lineHeight: '1',
        },
      },
      description: {
        style: { fontSize: '14px' },
      },
      divider: { style: {} },
    };

    const stepAOptions: StepOptionsInterface = window.structuredClone
      ? structuredClone(stepOptions)
      : JSON.parse(JSON.stringify(stepOptions));

    stepAOptions.label.style.backgroundColor = 'transparent';
    stepAOptions.label.style.color = 'var(--active-color)';

    const stepHOptions: StepOptionsInterface = window.structuredClone
      ? structuredClone(stepOptions)
      : JSON.parse(JSON.stringify(stepOptions));

    stepHOptions.divider = { style: {} };
    stepHOptions.divider.style.margin =
      layout === 'vertical' ? '0 10px' : '10px 0';
    stepHOptions.label.style.backgroundColor = 'transparent';
    stepHOptions.label.style.color = 'var(--gray)';
    stepHOptions.marker.style.backgroundColor = 'var(--pale-blue)';

    if (layout === 'vertical') {
      stepOptions.marker.style.border = '2px solid var(--grey)';
      stepOptions.marker.style.backgroundColor = 'var(--light-grey)';

      stepOptions.divider.style.margin = '5px 10px';
      stepAOptions.divider.style.margin = '5px 10px';

      stepOptions.marker.style.borderWidth = '1px';
      stepHOptions.marker.style.borderWidth = '1px';
      stepOptions.divider.style.background =
        'repeating-linear-gradient(var(--gray), var(--gray) 7px, transparent 7px, transparent 11px)';
      stepAOptions.divider.style.background =
        'repeating-linear-gradient(var(--gray), var(--gray) 7px, transparent 7px, transparent 11px)';
    }

    const options: StepsOptionsInterface = {
      currentTemplate,
      // Пример изменения глобальных цветов элементов
      // color: {
      //   active: 'var(--yellow-500)', // https://primeng.org/colors
      //   highlight: 'var(--green-500)', // https://primeng.org/colors
      // },
      template: {
        [currentTemplate]: {
          layout,
          step: stepOptions,
          stepA: stepAOptions,
          stepH: stepHOptions,
        },
      },
    };

    this.dialogService.open(StepsComponent, {
      data: {
        steps,
        options,
      },
      header: this.langUtils.convert(this.langFacade.getLang(), 'ISSUE_STAGES'),
      width: this.screenSize.signal.isDesktop() ? '60%' : '95%',
      dismissableMask: true,
      closable: true,
    });
  }

  onIssueCopy(data: {
    [key: string]: string | number | { [key: string]: string | number }[];
  }): void {
    const typeId = this.issueJoinData.issueType.issueTypeID;
    const { alias } = this.issueJoinData.issueType;
    const parentId = this.issueJoinData.issue.IssueID;
    this.saveIssueToStorage(data, parentId);
    if (!this.issueJoinData.issueType.useAsCustomTemplate) {
      this.router.navigate(['', 'issues', 'types', typeId]).then();
    } else {
      this.router
        .navigate(['', 'issues', 'types', alias, 'custom'], {
          queryParams: { typeId },
        })
        .then();
    }
    this.closeDialog.emit();
  }

  saveIssueToStorage(
    data: {
      [key: string]: string | number | { [key: string]: string | number }[];
    },
    parentId: string,
  ): void {
    localStorage.setItem('issue_data', JSON.stringify({ ...data, parentId }));
  }

  openAttachmentDialog() {
    let formData = { ...this.issueJoinData.issue.formData };
    const hasAttachmentFiles = this.checkAttachmentFiles(formData);
    if (hasAttachmentFiles) {
      const attachmentDialog = this.dialogService.open(
        IssuesCopyAttachmentDialogComponent,
        {
          header: this.translatePipe.transform('COPY_ISSUE_ATTACHMENT_TEXT'),
          closable: false,
        },
      );
      attachmentDialog.onClose.subscribe((result) => {
        if (!result) {
          formData = this.removeFiles(formData);
        }
        this.onIssueCopy(formData);
      });
    } else {
      this.onIssueCopy(formData);
    }
  }

  checkAttachmentFiles(formData: {
    [key: string]: string | number | { [key: string]: string | number }[];
  }): boolean {
    let result = false;
    this.issueJoinData.issueType.template?.forEach((temp) => {
      if (temp.type.includes('file') && formData[temp.formControlName]) {
        result = true;
      } else if (temp.type === 'arr-smart') {
        temp.arrSmartList.forEach((smartTemplate) => {
          if (smartTemplate.type.includes('file')) {
            (formData[temp.formControlName] as any[]).forEach((arrItem) => {
              result = result && !!arrItem[smartTemplate.formControlName];
            });
          }
        });
      }
    });
    return result;
  }

  removeFiles(formData: {
    [key: string]: string | number | { [key: string]: string | number }[];
  }): {
    [key: string]: string | number | { [key: string]: string | number }[];
  } {
    this.issueJoinData.issueType.template.forEach((temp) => {
      if (temp.type.includes('file') && formData[temp.formControlName]) {
        delete formData[temp.formControlName];
      } else if (temp.type === 'arr-smart') {
        temp.arrSmartList.forEach((smartTemplate) => {
          if (smartTemplate.type.includes('file')) {
            formData[temp.formControlName] = (
              formData[temp.formControlName] as any[]
            ).map((arrItem) => {
              delete arrItem[smartTemplate.formControlName];
              return arrItem;
            });
          }
        });
      }
    });
    return formData;
  }
}
