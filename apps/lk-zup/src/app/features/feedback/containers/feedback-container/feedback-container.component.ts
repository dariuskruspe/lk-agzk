import {
  ChangeDetectorRef,
  Component,
  inject,
  Inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  BREADCRUMB,
  provideBreadcrumb,
} from '@features/main/utils/breadcrumb-provider.utils';
import { LangFacade } from '@shared/features/lang/facades/lang.facade';
import { AppService } from '@shared/services/app.service';
import { CustomDialogService } from '@shared/services/dialog.service';
import { FilterService } from '@shared/services/filter.service';
import {
  Preloader,
  providePreloader,
} from '@shared/services/preloader.service';
import { DialogService } from 'primeng/dynamicdialog';
import { ProgressBar } from 'primeng/progressbar';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { ItemListBuilderInterface } from '@shared/components/item-list-builder/models/item-list-builder.interface';
import { FilterParamsInterface } from '@shared/models/filter-params.interface';
import { FeedbackService } from '@features/feedback/sevices/feedback.service';
import { AgreementsEmployeeInterface } from '@features/agreements-employee/models/agreement-employee.interface';
import {
  FEEDBACK_DATA_CONFIG,
  FEEDBACK_ITEM_LAYOUT,
} from '@features/feedback/constants/feedback-data-config';
import { AgreementsEmployeeDocumentStateInterface } from '@features/agreements-employee/models/agreements-employee-document-state.interface';
import { MenuItem } from 'primeng/api';
import { FileBase64 } from '@shared/models/files.interface';
import { SafeResourceUrl } from '@angular/platform-browser';
import { FileDownloadService } from '@shared/services/file-download.service';
import { FileSanitizerClass } from '@shared/utilits/download-file.utils';

@Component({
    selector: 'app-feedback-container',
    templateUrl: './feedback-container.component.html',
    styleUrls: ['./feedback-container.component.scss'],
    providers: [
        providePreloader(ProgressBar),
        {
            provide: DialogService,
            useClass: CustomDialogService,
        },
        provideBreadcrumb('FEEDBACK', 0),
    ],
    standalone: false
})
export class FeedbackContainerComponent implements OnInit {
  app: AppService = inject(AppService);

  screenSize = this.app.storage.screen.data.frontend.size;

  isMobileV = this.screenSize.signal.isMobileV;

  loading$ = new BehaviorSubject<boolean>(false);

  timeoutId: ReturnType<typeof setTimeout>;

  filterValue: any = {
    useSkip: true,
    count: 15,
    page: 1,
  };

  dataTemplate = FEEDBACK_ITEM_LAYOUT;

  dataConfig: ItemListBuilderInterface[] = [...FEEDBACK_DATA_CONFIG];

  agreementsEmployeeList: AgreementsEmployeeInterface = {
    count: 0,
    documents: [],
  };

  stateList: AgreementsEmployeeDocumentStateInterface;

  currentPage = 1;

  activeTab: 'ALL_ISSUES' | 'ATTENTION' | 'ABOUT_ME' | 'GRATITUDE' =
    'ALL_ISSUES';

  isReportLoadingSignal: WritableSignal<boolean> = signal(false);

  saveReportResultButtonItems: MenuItem[] = [
    {
      label: 'xlsx',
      command: () => {
        this.downloadResultReport('xlsx');
      },
    },
    {
      label: 'pdf',
      command: () => {
        this.downloadResultReport('pdf');
      },
    },
  ];

  constructor(
    private ref: ChangeDetectorRef,
    private filterService: FilterService,
    private feedbackService: FeedbackService,
    public dialog: DialogService,
    private preloader: Preloader,
    private langFacade: LangFacade,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(BREADCRUMB) private _: unknown,
    private fileDownloader: FileDownloadService,
    private fileSanitizer: FileSanitizerClass,
  ) {}

  ngOnInit(): void {
    this.loading$.next(true);
    this.preloader.setCondition(this.loading$);
    const { queryParams } = this.route.snapshot;
    if (queryParams.tab) {
      this.activeTab = queryParams.tab as 'ALL_ISSUES' | 'ATTENTION' | 'ABOUT_ME' | 'GRATITUDE';
    }
    this.getStates().then(() => {
      this.getRequestList(
        {
          count: 15,
          page: queryParams.page || 1,
          useSkip: true,
        },
        this.getSectionNameByTab(this.activeTab),
      ).then(() => {});
    });
  }

  onLoadList(param: FilterParamsInterface): void {
    if (param.page && +param.page !== this.currentPage) {
      this.currentPage = +param.page;
      this.getRequestList(
        param,
        this.getSectionNameByTab(this.activeTab),
      ).then(() => {});
    }
  }

  onFeedbackItem(data: any) {
    this.router
      .navigate(['feedback', data.id], {
        queryParams: {
          questionnaireID: data.fileName,
          senderID: data.fileID,
        },
      })
      .then();
  }

  async getRequestList(
    param: FilterParamsInterface,
    section: 'general' | 'attention' | 'aboutMe' | 'gratitude',
  ): Promise<void> {
    const list = await firstValueFrom(
      this.feedbackService.getFeedbackRequests(param, section),
    );
    this.agreementsEmployeeList = {
      count: list.count,
      documents: list.feedback.map((feedback) => {
        return {
          fileID: feedback.senderID,
          state: feedback.stateID,
          id: feedback.feedbackID,
          fileName: feedback.questionnaireID,
          name: section !== 'aboutMe' ? feedback.recipientName: feedback.senderName,
          employeeName: feedback.type,
          fileOwner: 'issue',
          stateDate: new Date(feedback.date).toISOString(),
          mandatory: true,
          refuseSignatureEnabled: false,
          iconName: 'pi pi-pen-to-square',
        };
      }),
    };
    this.loading$.next(false);
  }

  async getStates(): Promise<void> {
    const states = await firstValueFrom(
      this.feedbackService.getFeedbackStates(),
    );
    this.stateList = {
      documentsStates: states.states.map((state) => {
        return {
          id: state.stateID,
          name: state.name,
          color: state.color,
          sign: false,
          buttonCaption: '',
          alias: state.alias,
        };
      }),
    };
  }

  changeTab(
    tabName: 'ALL_ISSUES' | 'ATTENTION' | 'ABOUT_ME' | 'GRATITUDE',
  ): void {
    this.loading$.next(true);
    if (this.activeTab !== tabName) {
      this.activeTab = tabName;
      this.router.navigate([], { queryParams: { tab: tabName }, queryParamsHandling: 'merge' });
      this.getRequestList(
        {
          count: 15,
          page: 1,
          useSkip: true,
        },
        this.getSectionNameByTab(this.activeTab),
      ).then(() => {});
    }
  }

  getSectionNameByTab(
    tabName: 'ALL_ISSUES' | 'ATTENTION' | 'ABOUT_ME' | 'GRATITUDE',
  ): 'general' | 'attention' | 'aboutMe' | 'gratitude' {
    switch (tabName) {
      case 'ALL_ISSUES':
        return 'general';
      case 'ATTENTION':
        return 'attention';
      case 'ABOUT_ME':
        return 'aboutMe';
      case 'GRATITUDE':
        return 'gratitude';
    }
  }

  downloadResultReport(format: 'xlsx' | 'pdf' = 'pdf'): void {
    this.downloadReport(format).then(() => {});
  }

  async downloadReport(format: 'pdf' | 'xlsx'): Promise<void> {
    this.isReportLoadingSignal.set(true);
    let reportFile
      :
      FileBase64;
    try {
      reportFile = await firstValueFrom(
        this.feedbackService.getDownloadReport(format),
      );
    } finally {
      this.isReportLoadingSignal.set(false);
    }

    const safeURL: SafeResourceUrl =
      this.fileSanitizer.getSafeResourceURLFromFileBase64Data(
        reportFile.file64,
        reportFile.fileExtension,
      );
    await this.fileDownloader.download(safeURL, reportFile.fileName);
    return;
  }
}
