export interface SurveySettingsInterface {
  name: string;
  description: string;
  coordinators: string[];
  startDate: string;
  endDate: string;
  surveyType: 'anonymous' | 'nonAnonymous';
  organizations: string[];
  divisions: string[];
  individuals: string[];
  conclusion: string;
  enableReminders: boolean;
  remindersFrequency: string;
  enableAdditionalReminders: boolean;
  additionalRemindersStartPeriod: string;
  additionalRemindersFrequency: string;
}
export interface OptionListSurveyInterface {
  optionList: OptionListItemSurveyInterface[];
}

export interface OptionListItemSurveyInterface {
  optionID?: string;
  representation?: string;
  value: string;
  flag?: null;
  title?: string;
}

export interface SurveyRequestInterface {
  surveyID?: string;
  name: string;
  description: string;
  coordinators: string[];
  startDate: string;
  endDate: string;
  isDraft: boolean;
  conclusion?: string;
  surveyType: 'anonymous' | 'nonAnonymous';
  respondents: {
    organizations: string[];
    divisions: string[];
    individuals: string[];
  };
  editingAvailable?: boolean;
  questions: SurveyFieldRequestInterface[];
  state?: string;
  stateName?: string;
  approvalAvailable?: boolean;
  reminders?: {
    enableReminders: boolean;
    remindersFrequency: string;
    enableAdditionalReminders: boolean;
    additionalRemindersStartPeriod: string;
    additionalRemindersFrequency: string;
  };
}

export interface SurveyResponseInterface extends SurveyRequestInterface {
  state: string;
  stateName?: string;
  comment: string;
  approvalAvailable?: boolean;
}

export interface SurveyFieldRequestInterface {
  questionType: 'simple' | 'file';
  answerType: 'text' | 'oneOption' | 'severalOptions' | 'notRequired';
  answerOptions?: {
    formulation: string;
  }[];
  questionID?: string;
  elementaryQuestionID?: string;
  formulation: string;
  required: boolean;
  section: string;
  answer?: string;
  fileData?: {
    fileName: string;
    file64: string;
    fileLink?: string;
  };
}

export interface SurveyFieldInterface {
  type: 'text' | 'select' | 'checkbox' | 'divider' | 'file';
  formulation: string;
  options?: { formulation: string }[];
  required: boolean;
  fileData?: {
    fileName: string;
    file64: string;
  };
}

export interface SurveysListInterface {
  surveys: SurveyResponseInterface[];
  count: number;
  creationAvailable: boolean;
}

export interface SurveyResultRequestInterface {
  isDraft: boolean;
  answers: {
    questionID: string;
    elementaryQuestionID: string;
    answer: string | string[];
    noAnswer: boolean;
    cellNumber?: number;
  }[];
}

export interface SurveyHistoryItemInterface {
  color: string;
  comment: string;
  date: string;
  stateID: string;
  stateName: string;
  userID: string;
  userName: string;
}

export interface SurveyFilterParamsInterface {
  useSkip?: boolean,
  count: number,
  page: number,
  search?: string,
  type?: 'anonymous' | 'nonAnonymous',
  days?: string,
  state?: string[],
  author?: string[],
}
