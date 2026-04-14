import { BackendVisualTheme } from './theme.model';

export interface SettingsInterface {
  general: SettingsGeneralInterface;
  dashboard: SettingsDashboardInterface;
  userProfile: SettingsUserProfileInterface;
  header: SettingsHeaderInterface;
  employeeRequests: SettingsEmployeeRequestsInterface;
  employees: SettingsEmployeesInterface;
  myDocuments: SettingsMyDocumentsInterface;
  insurance: SettingsInsuranceInterface;
  managerDocuments: SettingsManagerDocumentsInterface;
  employeeDocuments: SettingsEmployeeDocuments;
  vacationSchedule: SettingsVacationScheduleInterface;
  support: SettingsSupportInterface;
  jivosite: SettingsJivositeInterface;
  assistant?: SettingsAssistantInterface;
  payroll: {
    enable: boolean;
    averageIncome: { enable: boolean };
    taxAllowance: { enable: boolean };
    createIssueButton: { enable: boolean };
  };
  goals: { enable: boolean; tooltip: string };
  issues: SettingsIssuesInterface;
  businessTrips: BusinessTrips;
  weekendWork: SettingsWeekendWorkInterface;
  onboarding: boolean;
  employeesVacations?: SettingsEmployeeRequestsInterface;
  vacationBalances?: SettingsEmployeeRequestsInterface;
  presentation: SettingsHrPresentation;
  surveysManagement: {
    enable: boolean;
    respondentsChoiceHelp: string;
    coordinatorsChoiceHelp: string;
  };
  surveys: { enable: boolean };
  unscheduledVacationIssueTypeID: string;
  custom: { id: string; enable: boolean }[];
  feedback: { enable: boolean };
  feedbackManagement: { enable: boolean };
  myTeam: { enable: boolean };
  myTimesheet?: { enable: boolean };
  teamTimesheet?: { enable: boolean };
  talents: { enable: boolean; EditingEnable: boolean; enable9boxGrid: boolean };
  successors: { enable: boolean };
  evaluation?: { enable: boolean };
  evaluationManagement?: { enable: boolean };
  cache: { enable: boolean };
  manageIssueTemplates: { enable: boolean };
  manageSectionTemplates: { enable: boolean };
  manageNewsletter: { enable: boolean };
  employeeBusinessTrips: SettingsEmployeeRequestsInterface;
}

export enum RevokeInitiator {
  'Nobody' = 'Nobody',
  'Both' = 'Both',
  'Manager' = 'Manager',
  'Employee' = 'Employee',
}

export interface SettingsWeekendWorkInterface {
  basisEnable: boolean;
  isDayOffDateRequired: boolean;
}

export interface SettingsGeneralInterface {
  /**
   * Доступные типы авторизации:
   * 1. Логин (email) + пароль
   * 2. SSO
   * 3. SMS с кодом подтверждения входа в ЛКС на указанный номер телефона).
   */
  authType: SettingsAuthType | SettingsAuthType[];
  /**
   * Ссылка (относительно пути к API) на файл favicon'а (иконки, отображающейся на вкладке с приложением ЛКС в браузере).
   */
  favicon?: string;
  /**
   * Ссылка (относительно пути к API) на файл "основного логотипа", использующегося на странице входа в ЛКС ('/auth') в
   * верхней части блока с формой авторизации. Если логотип не указан, то значением будет null.
   */
  mainLogo?: string;
  languageCode: string;
  languages?: string[];
  visualTheme: BackendVisualTheme;
  signatureValidation: boolean;
  version: string;
  sentryEnabled?: boolean;
  refuseSignatureEnabled: boolean;
  onboardingEnabled?: boolean;
  demoMode?: boolean;
  dataCollectionEnabled: boolean;
  hrPortalUrl?: string;
  pushNotificationsEnabled: boolean;
  skipLoginButton: boolean;
  authSsoHttpMethod: 'GET' | 'POST';
}

export interface SettingsHeaderInterface {
  langButton: { enable: boolean };
  organizationButton: { enable: boolean };
  supportButton: { enable: boolean };
  themeButton: { enable: boolean };
}

export interface SettingsItemInterface {
  enable: boolean;
}

export interface SettingsDashboardInterface {
  enable: boolean;
  payroll: {
    enable: boolean;
    type: 'default' | 'intro';
  };
  vacations: {
    vacationsChange: boolean;
    vacationsOneTimeReschedulling: boolean;
    vacationBalanceAvailible: boolean;
  };
  newVersion: boolean;
}

export interface SettingsUserProfileInterface {
  useMagicLink: boolean;
  enable: boolean;
  relativesType: 'simple' | 'standart';
  showSalary: boolean;
  electronicSignature: {
    enable: boolean;
  };
  changeSurnameButton: {
    enable: boolean;
  };
  changeCitizenshipButton: {
    enable: boolean;
  };
  changePassportButton: {
    enable: boolean;
  };
  changePassword: {
    enable: boolean;
  };
  appSettings: {
    enable: boolean;
  };
  changeRegistrationAddressButton: {
    enable: boolean;
  };
  changeActualAddressButton: {
    enable: boolean;
  };
  changeOtherInfoButton: {
    enable: boolean;
  };
  changeRelativesButton: {
    enable: boolean;
  };
  changeContactsButton: {
    enable: boolean;
  };
  photoUpload: {
    enable: boolean;
  };
}

export interface SettingsEmployeeRequestsInterface {
  enable: boolean;
  newVersion?: boolean;
}

export interface SettingsEmployeesInterface {
  enable: boolean;
  enableOrganizationFilter: boolean;
}

export interface SettingsMyDocumentsInterface {
  enable: boolean;
  useOnlyPersonalCertificates?: boolean;
}

export interface SettingsManagerDocumentsInterface {
  enable: boolean;
  useOnlyOrgCertificates?: boolean;
}

export interface SettingsInsuranceInterface {
  enable: boolean;
}

export interface SettingsVacationScheduleInterface {
  enable: boolean;
  revokeFromVacation?: RevokeInitiator;
  vacationDepartmentsFilterEnabled?: boolean;
  newVersion?: boolean;
}

export interface SettingsSupportInterface {
  enable: boolean;
}

export interface SettingsJivositeInterface {
  enable: boolean;
  showOnAllPages: boolean;
  showOnAuthorizationPage: boolean;
}

export interface SettingsAssistantInterface {
  enable: boolean;
  aiEnabled?: boolean;
  aiApiUrl?: string;
  llmType?: number;
  llmModel?: string;
}

export interface SettingsIssuesInterface {
  enable: boolean;
  issueCancelAccess: boolean;
  // Доступен ли комментарий руководителя при согласовании
  // (см. https://padocs.1c-wiseadvice.ru/dlya-razrabotchikov/nastroiki-lks/nastroiki-prilozheniya-lks-bek/obshie/nastroiki-soglasovaniya/kommentarii-rukovoditelya)
  enableApproveComment: boolean;
  // Доступен ли комментарий руководителя при отклонении
  // (см. https://padocs.1c-wiseadvice.ru/dlya-razrabotchikov/nastroiki-lks/nastroiki-prilozheniya-lks-bek/obshie/nastroiki-soglasovaniya/kommentarii-rukovoditelya)
  enableCancelComment: boolean;
  // Обязателен ли комментарий руководителя при согласовании
  // (см. https://padocs.1c-wiseadvice.ru/dlya-razrabotchikov/nastroiki-lks/nastroiki-prilozheniya-lks-bek/obshie/nastroiki-soglasovaniya/kommentarii-rukovoditelya)
  requiredApproveComment: boolean;
  // Обязателен ли комментарий руководителя при отклонении
  // (см. https://padocs.1c-wiseadvice.ru/dlya-razrabotchikov/nastroiki-lks/nastroiki-prilozheniya-lks-bek/obshie/nastroiki-soglasovaniya/kommentarii-rukovoditelya)
  requiredCancelComment: boolean;
}

export interface BusinessTrips {
  enable: boolean;
  organizationEnable: boolean;
  expensesEnable: boolean;
  expenseReportsEnable: boolean;
  basisEnable: boolean;
  businessTripsIssues: {
    enable: boolean;
  };
  newVersion?: boolean;
}

export interface SettingsHrPresentation {
  enabled: boolean;
}

export interface SettingsEmployeeDocuments {
  enable: boolean;
}

export type SettingsAuthType = 'login' | 'sso' | 'sms';
