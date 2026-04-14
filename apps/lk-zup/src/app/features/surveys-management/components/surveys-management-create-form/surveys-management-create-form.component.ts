import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  EventEmitter,
  inject,
  OnInit,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SurveysManagementCreateService } from '@features/surveys-management/sevices/surveys-management-create.service';
import { firstValueFrom } from 'rxjs';
import { SurveysManagementService } from '@features/surveys-management/sevices/surveys-management.service';
import {
  OptionListSurveyInterface,
  SurveyFieldInterface,
  SurveyFieldRequestInterface,
  SurveyRequestInterface,
  SurveySettingsInterface,
} from '@features/surveys-management/models/surveys-management.interface';
import { Router } from '@angular/router';
import { AppService } from '@shared/services/app.service';
import { TranslatePipe } from '@shared/features/lang/pipes/lang.pipe';
import { ConfirmationService } from 'primeng/api';
import { MessageType } from '@shared/features/message-snackbar/models/message-type.enum';
import { MessageSnackbarService } from '@shared/features/message-snackbar/message-snackbar.service';

@Component({
    selector: 'app-surveys-management-create-form',
    templateUrl: './surveys-management-create-form.component.html',
    styleUrls: ['./surveys-management-create-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class SurveysManagementCreateFormComponent implements OnInit {
  form: FormGroup;

  surveysManagementCreateService: SurveysManagementCreateService = inject(
    SurveysManagementCreateService,
  );

  surveySettings: WritableSignal<SurveySettingsInterface | null> =
    this.surveysManagementCreateService.surveySettings;

  surveyFields: WritableSignal<SurveyFieldInterface[]> =
    this.surveysManagementCreateService.surveyFields;

  coordinatorsList: OptionListSurveyInterface;

  organizationsList: OptionListSurveyInterface;

  divisionsList: OptionListSurveyInterface;

  individualsList: OptionListSurveyInterface;

  frequencyList: OptionListSurveyInterface;

  @Output() cancelForm = new EventEmitter();

  fieldTypes = [
    { name: this.translatePipe.transform('SECTION'), value: 'divider' },
    { name: this.translatePipe.transform('TEXT'), value: 'text' },
    {
      name: this.translatePipe.transform('SEVERAL_OPTIONS'),
      value: 'checkbox',
    },
    { name: this.translatePipe.transform('ONE_OPTIONS'), value: 'select' },
    { name: this.translatePipe.transform('BUTTON_FILE'), value: 'file' },
  ];

  surveys: WritableSignal<SurveyFieldInterface[]> =
    this.surveysManagementCreateService.surveyFields;

  settings = computed(() => {
    return this.app.storage.settings.data.frontend.signal.globalSettings();
  });

  respondentsChoiceHelp: string;

  coordinatorsChoiceHelp: string;

  selectedType: 'text' | 'select' | 'checkbox' | 'divider' | 'file';

  currentDate = new Date();

  isSurveyLoadingSignal: WritableSignal<boolean> = signal(false);

  showDividerError: WritableSignal<boolean> = signal(false);

  constructor(
    private fb: FormBuilder,
    private surveysManagementService: SurveysManagementService,
    private router: Router,
    private ref: ChangeDetectorRef,
    private app: AppService,
    private translatePipe: TranslatePipe,
    private confirmationService: ConfirmationService,
    private messageSnackbarService: MessageSnackbarService,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getCoordinators().then(() => {});
    this.getOrganizations().then(() => {});
    this.getDivisions().then(() => {});
    this.getIndividuals().then(() => {});
    this.getFrequency().then(() => {});
    this.respondentsChoiceHelp = this.respondentsChoiceHelpText();
    this.coordinatorsChoiceHelp = this.coordinatorsChoiceHelpText();
  }

  initForm(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
      coordinators: [[], [Validators.required]],
      organizations: [[]],
      divisions: [[]],
      individuals: [[]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      surveyType: ['', [Validators.required]],
      conclusion: [''],
      enableReminders: [false],
      remindersFrequency: [''],
      enableAdditionalReminders: [false],
      additionalRemindersStartPeriod: [''],
      additionalRemindersFrequency: [''],
    });
    if (this.surveySettings()) {
      this.form.patchValue(this.surveySettings());
      this.form
        .get('startDate')
        .setValue(new Date(this.surveySettings().startDate));
      this.form
        .get('endDate')
        .setValue(new Date(this.surveySettings().endDate));
    }
    if (this.surveysManagementCreateService.disableEditForm()) {
      this.form.disable();
      this.form.get('startDate').enable();
      this.form.get('endDate').enable();
    }
  }

  onSubmit(isDraft = false) {
    this.markAsTouched(this.form);
    const hasEmptySections = !!this.surveyFields().filter(field => field.type === 'divider' && !field.formulation).length;
    if (hasEmptySections) this.showDividerError.set(true);
    if (this.form.valid && !hasEmptySections) {
      this.isSurveyLoadingSignal.set(true);
      const survey: SurveyRequestInterface = this.getRequestOptions(isDraft);
      if (!survey) return;
      if (this.surveysManagementCreateService.surveyId()) {
        this.updateSurvey(
          survey,
          this.surveysManagementCreateService.surveyId(),
        ).then(() => {
          this.isSurveyLoadingSignal.set(false);
          this.onCansel();
        }).catch(() => {
          this.isSurveyLoadingSignal.set(false);
        });
      } else {
        this.createSurvey(survey).then(() => {
          this.isSurveyLoadingSignal.set(false);
          this.onCansel();
        }).catch(() => {
          this.isSurveyLoadingSignal.set(false);
        });
      }
    }
  }

  async createSurvey(survey: SurveyRequestInterface): Promise<void> {
    const result = await firstValueFrom(
      this.surveysManagementService.createSurvey(survey),
    );
    this.router.navigate(['surveys-management', result.survey.surveyID]).then();
  }

  async updateSurvey(
    survey: SurveyRequestInterface,
    id: string,
  ): Promise<void> {
    const result = await firstValueFrom(
      this.surveysManagementService.updateSurvey(survey, id),
    );
    this.router.navigate(['surveys-management', result.survey.surveyID]).then();
  }

  onSubmitDraft() {
    this.onSubmit(true);
  }

  changeForm() {
    this.surveySettings.set(this.form.value);
  }

  async getCoordinators() {
    if (this.surveysManagementCreateService.coordinatorsList()) {
      this.coordinatorsList =
        this.surveysManagementCreateService.coordinatorsList();
    } else {
      this.coordinatorsList = await firstValueFrom(
        this.surveysManagementService.getOptions('surveyCoordinators'),
      );
    }
  }

  async getOrganizations() {
    if (this.surveysManagementCreateService.organizationsList()) {
      this.organizationsList =
        this.surveysManagementCreateService.organizationsList();
    } else {
      this.organizationsList = await firstValueFrom(
        this.surveysManagementService.getOptions('surveyRespondentOrgs'),
      );
    }
  }

  async getDivisions() {
    if (this.surveysManagementCreateService.divisionsList()) {
      this.divisionsList = this.surveysManagementCreateService.divisionsList();
    } else {
      this.divisionsList = await firstValueFrom(
        this.surveysManagementService.getOptions('surveyRespondentDivisions'),
      );
    }
  }

  async getIndividuals() {
    if (this.surveysManagementCreateService.individualsList()) {
      this.individualsList =
        this.surveysManagementCreateService.individualsList();
    } else {
      this.individualsList = await firstValueFrom(
        this.surveysManagementService.getOptions('surveyRespondents'),
      );
    }
  }

  async getFrequency() {
    if (this.surveysManagementCreateService.frequencyList()) {
      this.frequencyList = this.surveysManagementCreateService.frequencyList();
    } else {
      this.frequencyList = await firstValueFrom(
        this.surveysManagementService.getOptions('surveyRemindersFrequency'),
      );
    }
  }

  getRequestOptions(isDraft: boolean): SurveyRequestInterface | null {
    const survey: SurveyRequestInterface = {
      name: this.form.value.name,
      description: this.form.value.description,
      coordinators: this.form.value.coordinators,
      surveyType: this.form.value.surveyType,
      conclusion: this.form.value.conclusion,
      startDate: this.form.value.startDate.toISOString(),
      endDate: this.form.value.endDate.toISOString(),
      isDraft,
      respondents: {
        organizations: this.form.value.organizations,
        divisions: this.form.value.divisions,
        individuals: this.form.value.individuals,
      },
      questions: [],
      reminders: {
        enableReminders: this.form.value.enableReminders,
        remindersFrequency: this.form.value.remindersFrequency,
        enableAdditionalReminders: this.form.value.enableAdditionalReminders,
        additionalRemindersStartPeriod:
          this.form.value.additionalRemindersStartPeriod,
        additionalRemindersFrequency:
          this.form.value.additionalRemindersFrequency,
      },
    };
    const surveyFields = [...this.surveyFields()];
    const questions: SurveyFieldRequestInterface[] = [];

    // если есть раздел блока вопросов, используем его в section
    let section: string = '---';
    // мапим поля
    surveyFields.forEach((field) => {
      if (
        field.type === 'text' ||
        field.type === 'select' ||
        field.type === 'checkbox'
      ) {
        const requestField: SurveyFieldRequestInterface = {
          questionType: 'simple',
          answerType:
            field.type === 'text'
              ? 'text'
              : field.type === 'select'
                ? 'oneOption'
                : field.type === 'checkbox'
                  ? 'severalOptions'
                  : 'text',
          formulation: field.formulation,
          required: field.required,
          section,
        };

        if (field.options?.length) {
          requestField.answerOptions = field.options.map((option) => {
            return { formulation: option.formulation };
          });
        }
        questions.push(requestField);
      } else if (field.type === 'divider') {
        section = field.formulation;
        // if (!field.formulation) {
        //   this.showDividerError.set(true);
        //   console.log(8989);
        //   return null;
        //   // this.messageSnackbarService.show({title: 'Ошибка создания опроса', message: 'Отсутствует параметр "section"'}, MessageType.error);
        // }
      } else if (field.type === 'file') {
        const requestField: SurveyFieldRequestInterface = {
          questionType: 'file',
          fileData: field.fileData,
          answerType: 'notRequired',
          formulation: field.formulation,
          required: false,
          section,
        };
        questions.push(requestField);
      }
    });
    survey.questions = questions;
    return survey;
  }

  markAsTouched(group: FormGroup): void {
    const controls = Array.isArray(group.controls)
      ? group.controls
      : Object.values(group.controls);
    for (const control of controls) {
      control.markAsDirty();
      control.markAsTouched();
      control.updateValueAndValidity();
    }
  }

  onCansel() {
    if (this.surveysManagementCreateService.surveyId()) {
      this.cancelForm.emit();
    } else {
      this.router.navigate(['surveys-management']).then();
    }
  }

  getSubmitButtonLabel() {
    return 'BUTTON_SEND';
  }

  addField() {
    const fields = [...this.surveys()];
    switch (this.selectedType) {
      case 'text':
      case 'divider':
        fields.push({
          type: this.selectedType,
          formulation: '',
          required: false,
        });
        this.ref.markForCheck();
        break;
      case 'checkbox':
      case 'select':
        fields.push({
          type: this.selectedType,
          formulation: '',
          required: false,
          options: [{ formulation: '' }],
        });
        this.ref.markForCheck();
        break;
      case 'file':
        fields.push({
          type: this.selectedType,
          formulation: '',
          required: false,
        });
        this.ref.markForCheck();
        break;
      default:
        break;
    }
    this.resetListBox();
    this.surveys.set(fields);
    this.ref.detectChanges();
  }

  resetListBox() {
    this.selectedType = null;
    const types = [...this.fieldTypes];
    this.fieldTypes = [];
    setTimeout(() => {
      this.fieldTypes = [...types];
    }, 10);
  }

  respondentsChoiceHelpText = computed(() => {
    const settings = this.settings();
    return settings.surveysManagement.respondentsChoiceHelp;
  });

  coordinatorsChoiceHelpText = computed(() => {
    const settings = this.settings();
    return settings.surveysManagement.coordinatorsChoiceHelp;
  });

  confirm(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      acceptLabel: '',
      rejectLabel: '',
      key: 'types',
      accept: () => {},
      reject: () => {},
    });
  }

  setRemindersFrequencyValidator(value: { checked: boolean }) {
    if (value.checked) {
      this.form.get('remindersFrequency').addValidators(Validators.required);
    } else {
      this.form.get('remindersFrequency').removeValidators(Validators.required);
    }
  }

  setEnableAdditionalRemindersValidator(value: { checked: boolean }) {
    if (value.checked) {
      this.form.get('additionalRemindersStartPeriod').addValidators(Validators.required);
      this.form.get('additionalRemindersFrequency').addValidators(Validators.required);
    } else {
      this.form.get('additionalRemindersStartPeriod').removeValidators(Validators.required);
      this.form.get('additionalRemindersFrequency').removeValidators(Validators.required);
    }
  }
}
