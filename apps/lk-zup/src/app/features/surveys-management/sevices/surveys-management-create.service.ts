import { Injectable, signal, WritableSignal } from '@angular/core';
import {
  OptionListSurveyInterface,
  SurveyFieldInterface,
  SurveySettingsInterface,
} from '@features/surveys-management/models/surveys-management.interface';

@Injectable({ providedIn: 'root' })
export class SurveysManagementCreateService {
  surveyFields: WritableSignal<SurveyFieldInterface[]> = signal([]);

  surveySettings: WritableSignal<SurveySettingsInterface | null> = signal(null);

  coordinatorsList: WritableSignal<OptionListSurveyInterface | null> =
    signal(null);

  organizationsList: WritableSignal<OptionListSurveyInterface | null> =
    signal(null);

  divisionsList: WritableSignal<OptionListSurveyInterface | null> =
    signal(null);

  individualsList: WritableSignal<OptionListSurveyInterface | null> =
    signal(null);

  frequencyList: WritableSignal<OptionListSurveyInterface | null> =
    signal(null);

  surveyId: WritableSignal<string | null> = signal(null);

  disableEditForm: WritableSignal<boolean> = signal(false);
}
