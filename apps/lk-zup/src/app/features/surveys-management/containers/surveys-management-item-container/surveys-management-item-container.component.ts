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
import { firstValueFrom, Observable } from 'rxjs';
import { SurveysManagementService } from '@features/surveys-management/sevices/surveys-management.service';
import {
  OptionListSurveyInterface,
  SurveyFieldInterface,
  SurveyHistoryItemInterface,
  SurveyRequestInterface,
} from '@features/surveys-management/models/surveys-management.interface';
import { SurveysManagementCreateService } from '@features/surveys-management/sevices/surveys-management-create.service';
import { SurveysManagementEditFormComponent } from '@features/surveys-management/components/surveys-management-edit-form/surveys-management-edit-form.component';
import { MenuItem } from 'primeng/api';
import { FileDownloadService } from '@shared/services/file-download.service';
import { FileSanitizerClass } from '@shared/utilits/download-file.utils';
import { FileBase64 } from '@shared/models/files.interface';
import { SafeResourceUrl } from '@angular/platform-browser';
import { take } from 'rxjs/operators';

@Component({
    selector: 'app-surveys-management-item-container',
    templateUrl: './surveys-management-item-container.component.html',
    styleUrls: ['./surveys-management-item-container.component.scss'],
    providers: [
        providePreloader(ProgressBar),
        {
            provide: DialogService,
            useClass: CustomDialogService,
        },
        provideBreadcrumb('TITLE_SURVEYS_MANAGEMENT', 0),
    ],
    standalone: false
})
export class SurveysManagementItemContainerComponent implements OnInit {
  app: AppService = inject(AppService);

  screenSize = this.app.storage.screen.data.frontend.size;

  isMobileV = this.screenSize.signal.isMobileV;

  loading$: Observable<boolean>;

  activeTab: 'ALL_SURVEYS' | 'SURVEYS_APPROVAL' = 'SURVEYS_APPROVAL';

  cancelComment: string = '';

  survey: SurveyRequestInterface;

  states: { stateID: string; name: string; color: string; alias: string }[];

  surveysManagementCreateService: SurveysManagementCreateService = inject(
    SurveysManagementCreateService,
  );

  historyList: SurveyHistoryItemInterface[] = [];

  isReportLoadingSignal: WritableSignal<boolean> = signal(false);

  saveReportStatButtonItems: MenuItem[] = [
    {
      label: 'xlsx',
      command: () => {
        this.downloadStatReport('xlsx');
      },
    },
    {
      label: 'pdf',
      command: () => {
        this.downloadStatReport('pdf');
      },
    },
  ];

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
    private surveysManagementService: SurveysManagementService,
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
    this.initSurvey();
    this.getCoordinators().then(() => {});
    this.getOrganizations().then(() => {});
    this.getDivisions().then(() => {});
    this.getIndividuals().then(() => {});
    this.getFrequency().then(() => {});
  }

  initSurvey(): void {
    const surveyId = this.route.snapshot.params.id;
    const { role } = this.route.snapshot.queryParams;
    this.getSurvey(surveyId, role).then(() => {
      if (this.survey && this.states && this.states.length) {
        this.surveysManagementCreateService.disableEditForm.set(
          this.getState().alias !== 'draft' && this.getState().alias !== 'rework' && this.getState().alias !== 'surveyDraft',
        );
      }
    });
    this.getSurveyHistory(surveyId).then(() => {});
    this.getSurveyStates().then(() => {
      if (this.survey && this.states && this.states.length) {
        this.surveysManagementCreateService.disableEditForm.set(
          this.getState().alias !== 'draft' && this.getState().alias !== 'rework' && this.getState().alias !== 'surveyDraft',
        );
      }
    });
  }

  async getSurvey(
    id: string,
    role: 'manager' | 'employee' | 'coordinator',
  ): Promise<void> {
    const survey = await firstValueFrom(
      this.surveysManagementService.getSurvey(id, role || 'manager'),
    );
    this.survey = survey.survey;
    this.ref.detectChanges();
  }

  async getSurveyHistory(id: string): Promise<void> {
    const history = await firstValueFrom(
      this.surveysManagementService.getSurveyHistory(id),
    );
    this.historyList = history.states;
    this.ref.detectChanges();
  }

  openEditDialog() {
    this.patchValues();
    const dialogRef = this.dialog.open(SurveysManagementEditFormComponent, {
      closable: true,
      dismissableMask: true,
      header: 'Изменение опроса',
      focusOnShow: false,
    });
    dialogRef.onClose.pipe(take(1)).subscribe(() => {
      this.initSurvey();
    });
  }

  async deleteSurvey(): Promise<void> {
    await firstValueFrom(
      this.surveysManagementService.deleteSurvey(this.survey.surveyID),
    );
    this.onBackPage();
  }

  getColor(color: string): string {
    if (!color) return '';
    return color.startsWith('#') ? color : `var(--${color})`;
  }

  patchValues() {
    this.surveysManagementCreateService.surveySettings.set({
      name: this.survey.name,
      description: this.survey.description,
      coordinators: this.survey.coordinators,
      startDate: this.survey.startDate,
      endDate: this.survey.endDate,
      surveyType: this.survey.surveyType,
      organizations: this.survey.respondents.organizations,
      divisions: this.survey.respondents.divisions,
      individuals: this.survey.respondents.individuals,
      conclusion: this.survey.conclusion,
      enableReminders: this.survey.reminders.enableReminders,
      remindersFrequency: this.survey.reminders.remindersFrequency,
      enableAdditionalReminders:
        this.survey.reminders.enableAdditionalReminders,
      additionalRemindersStartPeriod:
        this.survey.reminders.additionalRemindersStartPeriod,
      additionalRemindersFrequency:
        this.survey.reminders.additionalRemindersFrequency,
    });
    this.surveysManagementCreateService.surveyId.set(this.survey.surveyID);
    const surveyFields: SurveyFieldInterface[] = [];
    let previousSection = '---';
    this.survey.questions.forEach((question) => {
      if (question.section && question.section !== previousSection) {
        surveyFields.push({
          type: 'divider',
          formulation: question.section,
          required: false,
        });
        previousSection = question.section;
      }
      const surveyField =  {
        type: this.getQuestionType(question.answerType),
        formulation: question.formulation,
        options: question.answerOptions,
        required: question.required,
        fileData: question.fileData,
      };
      surveyFields.push(surveyField);
    });
    this.surveysManagementCreateService.surveyFields.set(surveyFields);
    this.surveysManagementCreateService.disableEditForm.set(
      this.getState().alias !== 'draft' && this.getState().alias !== 'rework' && this.getState().alias !== 'surveyDraft',
    );
  }

  getQuestionType(
    answerType: 'text' | 'oneOption' | 'severalOptions' | 'notRequired',
  ): 'text' | 'select' | 'checkbox' | 'file' {
    switch (answerType) {
      case 'text':
        return 'text';
      case 'oneOption':
        return 'select';
      case 'severalOptions':
        return 'checkbox';
      case 'notRequired':
        return 'file';
      default:
        return 'text';
    }
  }

  onBackPage(): void {
    this.router.navigate(['/surveys-management']).then();
  }

  async getSurveyStates(): Promise<void> {
    this.states = (
      await firstValueFrom(this.surveysManagementService.getSurveyStates())
    ).states;
  }

  getState(): { stateID?: string; name: string; color: string; alias: string } {
    return !this.survey
      ? {
          name: '',
          color: '',
          alias: '',
        }
      : this.states?.find((state) => state.stateID === this.survey.state) || {
          name: '',
          color: '',
          alias: '',
        };
  }

  async getCoordinators() {
    const coordinatorsList = await firstValueFrom(
      this.surveysManagementService.getOptions('surveyCoordinators'),
    );
    this.surveysManagementCreateService.coordinatorsList.set(coordinatorsList);
  }

  async getOrganizations() {
    const organizationsList = await firstValueFrom(
      this.surveysManagementService.getOptions('surveyRespondentOrgs'),
    );
    this.surveysManagementCreateService.organizationsList.set(
      organizationsList,
    );
  }

  async getDivisions() {
    const divisionsList = await firstValueFrom(
      this.surveysManagementService.getOptions('surveyRespondentDivisions'),
    );
    this.surveysManagementCreateService.divisionsList.set(divisionsList);
  }

  async getIndividuals() {
    const individualsList = await firstValueFrom(
      this.surveysManagementService.getOptions('surveyRespondents'),
    );
    this.surveysManagementCreateService.individualsList.set(individualsList);
  }

  async getFrequency() {
    const frequencyList = await firstValueFrom(
      this.surveysManagementService.getOptions('surveyRemindersFrequency'),
    );
    this.surveysManagementCreateService.frequencyList.set(frequencyList);
  }

  getOptionValue(optionList: string, id: string): string {
    return (
      (
        this.surveysManagementCreateService[
          optionList
        ]() as OptionListSurveyInterface
      )?.optionList?.find((option) => option.value === id)?.representation || ''
    );
  }

  async approveSurvey(approve: boolean): Promise<void> {
    await firstValueFrom(
      this.surveysManagementService.approveSurvey(
        approve,
        this.cancelComment,
        this.survey.surveyID,
      ),
    );
    window.location.reload();
  }

  downloadResultReport(format: 'xlsx' | 'pdf' = 'pdf') {
    this.downloadReport('surveyResults', format).then(() => {});
  }

  async downloadReport(
    reportType: 'surveyStatistics' | 'surveyResults',
    format: 'pdf' | 'xlsx',
  ): Promise<void> {
    this.isReportLoadingSignal.set(true);
    let reportFile: FileBase64;
    try {
      reportFile = await firstValueFrom(
        this.surveysManagementService.getDownloadReport(
          reportType,
          format,
          this.survey.surveyID,
        ),
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

  downloadStatReport(format: 'xlsx' | 'pdf' = 'pdf') {
    this.downloadReport('surveyStatistics', format).then(() => {});
  }
}
