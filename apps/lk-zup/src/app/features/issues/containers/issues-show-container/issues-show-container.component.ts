import { Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmployeesStaticDataManagerFacade } from '@features/employees/facades/employees-static-data-manager.facade';
import { IssuesAbstractShowContainer } from '@features/issues/containers/issues-abstract-show-container/issues-abstract-show-container.component';
import { IssuesApproveDialogContainerComponent } from '@features/issues/containers/issues-approve-dialog-container/issues-approve-dialog-container.component';
import { IssuesListFacade } from '@features/issues/facades/issues-list.facade';
import { IssuesStatusStepsFacade } from '@features/issues/facades/issues-status-steps.facade';
import { IssuesFacade } from '@features/issues/facades/issues.facade';
import { IssuesDocSignInterface } from '@features/issues/models/issues-doc-sign.interface';
import { IssueCancelInterface, IssuesStatusListInterface } from '@features/issues/models/issues.interface';
import { IssuesUpdaterService } from '@features/issues/services/issue-updater.service';
import { BreadcrumbsService } from '@features/main/services/breadcrumbs.service';
import {
  BREADCRUMB,
  provideBreadcrumb,
} from '@features/main/utils/breadcrumb-provider.utils';
import { LangFacade } from '@shared/features/lang/facades/lang.facade';
import { LangUtils } from '@shared/features/lang/utils/lang.utils';
import { SettingsFacade } from '@shared/features/settings/facades/settings.facade';
import { StepsOptionsInterface } from '@shared/interfaces/steps/options/steps-options.interface';
import { StepInterface } from '@shared/interfaces/steps/step.interface';
import { AppService } from '@shared/services/app.service';
import {
  Preloader,
  providePreloader,
} from '@shared/services/preloader.service';
import { StepsHelperService } from '@shared/services/steps/steps-helper.service';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { ProgressBar } from 'primeng/progressbar';
import { combineLatest, Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';

export type IssuesShowDialogData = {
  issueId: string;
  syncTabWithQueryParams?: boolean;
};

@Component({
    selector: 'app-issues-show-container',
    templateUrl: './issues-show-container.component.html',
    styleUrls: ['./issues-show-container.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideBreadcrumb(IssuesFacade, 1),
        providePreloader(ProgressBar),
        StepsHelperService,
    ],
    standalone: false
})
export class IssuesShowContainerComponent implements OnInit, OnDestroy {
  app = inject(AppService);

  screenSize = this.app.storage.screen.data.frontend.size;

  dashboard = true;

  isItDialog = false;

  isDraft = false;

  isHistory = false;

  syncTabWithQueryParams = true;

  private destroy$ = new Subject<void>();

  issueId: string;

  stepsOptions: StepsOptionsInterface = this.stepsHelper.initialOptions();

  constructor(
    public abstractIssuesContainer: IssuesAbstractShowContainer,
    @Inject(BREADCRUMB) private _: unknown,
    private preloader: Preloader,
    private activatedRoute: ActivatedRoute,
    private issueUpdater: IssuesUpdaterService,
    public dialogService: DialogService,
    private dialogConfig: DynamicDialogConfig<IssuesShowDialogData>,
    private dialogRef: DynamicDialogRef,
    public myIssuesListFacade: IssuesListFacade,
    public issuesStatusStepsFacade: IssuesStatusStepsFacade,
    public employeesStaticDataManagerFacade: EmployeesStaticDataManagerFacade,
    public langUtils: LangUtils,
    public langFacade: LangFacade,
    public settingsFacade: SettingsFacade,
    private stepsHelper: StepsHelperService,
    private breadcrumbsService: BreadcrumbsService,
    private location: Location,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initIssueId();
    this.syncTabWithQueryParams =
      this.dialogConfig?.data?.syncTabWithQueryParams ?? true;

    if (this.dialogConfig?.data?.issueId) {
      this.isItDialog = true;

      // перенесено из issues-show-dialog-container.component.ts -> constructor
      this.abstractIssuesContainer.myIssuesShowFacade
        .getLabel$()
        .pipe(take(1), takeUntil(this.destroy$))
        .subscribe((v) => {
          if (this.dialogConfig) this.dialogConfig.header = v;
        });

      this.abstractIssuesContainer.updateApplicationData();
    }

    // перенесено из constructor
    this.issueUpdater.needUpdate$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (!this.abstractIssuesContainer.issueId) {
          this.initIssueId();
        }
        this.abstractIssuesContainer.updateApplicationData();
      });

    this.preloader.setCondition(
      this.abstractIssuesContainer.myIssuesShowFacade.loading$(),
      this.abstractIssuesContainer.issuesStatusListFacade.loading$(),
      this.issuesStatusStepsFacade.loading$()
    );

    this.activatedRoute.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        if (params.draft) {
          this.isDraft = true;
        }
      });

    this.activatedRoute.params.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.load();
    });

    this.subscribeToActiveStepColorChange();
  }

  private subscribeToActiveStepColorChange(): void {
    combineLatest([
      this.issuesStatusStepsFacade.forcedData$,
      this.abstractIssuesContainer.issuesStatusListFacade.forcedData$
    ]).pipe(
      filter(([steps, statusList]) => !!steps?.length && !!statusList?.states?.length),
      takeUntil(this.destroy$)
    ).subscribe(([steps, statusList]) => {
      this.updateStepsOptionsColor(steps, statusList.states);
    });
  }

  private updateStepsOptionsColor(
    steps: StepInterface[],
    statusList: IssuesStatusListInterface[]
  ): void {
    const activeStep = steps.find((step) => step.active);
    if (!activeStep?.id) return;

    const activeStatus = statusList.find((status) => status.id === activeStep.id);
    if (!activeStatus?.color) return;

    this.stepsOptions = {
      ...this.stepsOptions,
      color: {
        ...this.stepsOptions.color,
        active: activeStatus.color
      }
    };
    this.cdr.markForCheck();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initIssueId() {
    this.issueId =
      this.dialogConfig?.data?.issueId ||
      this.activatedRoute.snapshot.params.id;
    this.abstractIssuesContainer.issueId = this.issueId;
  }

  private load() {
    this.initIssueId();
    this.abstractIssuesContainer.updateApplicationData();
  }

  getFile(id: string): void {
    this.abstractIssuesContainer.getFile(id);
  }

  docOnClick(doc: IssuesDocSignInterface): void {
    this.abstractIssuesContainer.docOnClick(doc);
  }

  onDownloadArch(): void {
    this.abstractIssuesContainer.onDownloadArch();
  }

  backPage(): void {
    if (this.isItDialog) this.dialogRef.close();
    else this.location.back();
  }

  closeDialog(): void {
    if (this.isItDialog) this.dialogRef.close();
  }

  onIssueCancel(data: IssueCancelInterface): void {
    this.abstractIssuesContainer.onIssueCancel(data);
  }

  async approveManually(isApproved: boolean, comment?: string): Promise<void> {
    const enableComment = isApproved
      ? this.settingsFacade.getData().issues.enableApproveComment
      : this.settingsFacade.getData().issues.enableCancelComment;
    if (!enableComment) {
      await this.abstractIssuesContainer.approveManually(isApproved, '');
      this.abstractIssuesContainer.updateApplicationData();
    } else {
      const header = isApproved ? 'BUTTON_APPROVE' : 'CANSEL_ISSUE';
      const required = isApproved
        ? this.settingsFacade.getData().issues.requiredApproveComment
        : this.settingsFacade.getData().issues.requiredCancelComment;
      const dialogRef = this.dialogService.open(
        IssuesApproveDialogContainerComponent,
        {
          width: '500px',
          data: { isApproved, comment, required },
          closable: true,
          header: this.langUtils.convert(this.langFacade.getLang(), header),
        }
      );

      dialogRef.onClose.subscribe(async (result) => {
        if (result?.result) {
          await this.abstractIssuesContainer.approveManually(
            isApproved,
            result.comment
          );
          this.abstractIssuesContainer.updateApplicationData();
        }
      });
    }
  }

  onHistoryOpen(isHistory: boolean): void {
    this.isHistory = isHistory;
  }
}
