import { IsActiveMatchOptions } from '@angular/router';
import { MenuConditionInterface } from '@app/shared/models/menu-condition.interface';
import {
  LayoutGridIcon,
  UserCogIcon,
  UserIcon,
  ShieldUserIcon,
  SettingsIcon,
  SquareUserIcon,
  SignatureIcon,
  MessageCircleIcon,
  QrCodeIcon,
  KeyIcon,
  LogOutIcon,
} from 'lucide-angular';

export const SIDEBAR_MENU_ITEMS = [
  {
    label: 'TITLE_DASHBOARD',
    icon: LayoutGridIcon,
    styleClass: 'cy-main-menu-dashboard',
    routerLink: '/',
    routerLinkActiveOptions: {
      matrixParams: 'ignored',
      fragment: 'ignored',
      paths: 'exact',
    } as IsActiveMatchOptions,
    state: {
      getVisibility: (data: MenuConditionInterface): boolean =>
        data.settings?.dashboard?.enable &&
        !data.signLater &&
        data.userSettings?.dashboard?.enable,
    },
    nameId: 'dashboard',
  },
  {
    label: 'TITLE_GROUP_MANAGER',
    icon: UserCogIcon,
    expanded: true,
    groupName: 'manager',
    state: {
      getVisibility: (data: MenuConditionInterface): boolean =>
        !data.signLater && getVisibilityManager(data),
    },
    items: [
      {
        label: 'TITLE_MY_TEAMS',
        routerLink: '/my-team',
        state: {
          getVisibility: (data: MenuConditionInterface): boolean =>
            data.settings?.myTeam?.enable && data.userSettings?.myTeam?.enable && !data.signLater,
          mobileIcon: '/assets/img/menu/my-team.svg',
        },
        nameId: 'myTeam',
      },
      {
        label: 'TITLE_DOCUMENTS_EMPLOYEE',
        routerLink: '/documents-employee',
        state: {
          getVisibility: (data: MenuConditionInterface): boolean =>
            data.settings?.employeeDocuments?.enable &&
            data.userSettings?.employeeDocuments?.enable,
          mobileIcon: '/assets/img/menu/documents.svg',
        },
        nameId: 'employeeDocuments',
      },
      {
        label: 'TITLE_ISSUES_MANAGEMENT',
        routerLink: '/issues-management',
        state: {
          getVisibility: (data: MenuConditionInterface): boolean =>
            data.settings?.employeeRequests?.enable &&
            data.userSettings?.employeeRequests?.enable,
          mobileIcon: '/assets/img/menu/issues.svg',
        },
        nameId: 'employeeRequests',
      },
      {
        label: 'TITLE_DOCUMENTS',
        routerLink: '/documents',
        state: {
          getVisibility: (data: MenuConditionInterface): boolean =>
            data.settings?.managerDocuments?.enable &&
            data.userSettings?.managerDocuments?.enable,
          mobileIcon: '/assets/img/menu/documents.svg',
        },
        nameId: 'managerDocuments',
      },

      // Пункт меню "Отпуска сотрудников"
      {
        label: 'TITLE_VACATIONS_EMPLOYEE',
        routerLink: '/vacations-management',
        state: {
          getVisibility: (data: MenuConditionInterface): boolean =>
            data.settings?.employeesVacations?.enable &&
            !data.signLater &&
            data.userSettings?.employeesVacations?.enable,
          mobileIcon: '/assets/img/menu/vacations.svg',
        },
        nameId: 'employeesVacations',
      },

      // Пункт меню "Остатки отпусков"
      {
        label: 'VACATION_BALANCES',
        routerLink: '/vacations-employee',
        state: {
          getVisibility: (data: MenuConditionInterface): boolean =>
            data.settings?.vacationBalances?.enable &&
            data?.userSettings?.vacationBalances?.enable && !data.signLater,
          mobileIcon: '/assets/img/menu/vacations-table.svg',
        },
        nameId: 'vacationBalances',
      },
      {
        label: 'TITLE_TIMESHEET',
        routerLink: '/timesheet/team',
        state: {
          getVisibility: (data: MenuConditionInterface): boolean =>
            getTimesheetVisibility(data, 'teamTimesheet'),
          mobileIcon: '/assets/img/menu/vacations-table.svg',
        },
        nameId: 'teamTimesheet',
      },
      {
        label: 'TITLE_BUSINESS_TRIPS',
        routerLink: '/employee-business-trip',
        state: {
          getVisibility: (data: MenuConditionInterface): boolean =>
            data?.userSettings?.employeeBusinessTrips?.enable && !data.signLater,
          mobileIcon: '/assets/img/menu/business-trips.svg',
        },
        nameId: 'employeeBusinessTrips',
      },
      {
        label: 'FEEDBACK',
        routerLink: '/feedback-management',
        state: {
          getVisibility: (data: MenuConditionInterface): boolean =>
            data.settings?.feedbackManagement?.enable &&
            !data.signLater &&
            data.userSettings?.feedbackManagement?.enable,
        },
        nameId: 'feedback',
      },
      {
        label: 'TALENTS',
        routerLink: '/talents',
        state: {
          getVisibility: (data: MenuConditionInterface): boolean =>
            data.settings?.talents?.enable &&
            !data.signLater &&
            data.userSettings?.talents?.enable,
        },
        nameId: 'talents',
      },
      {
        label: 'SUCCESSORS',
        routerLink: '/successors',
        state: {
          getVisibility: (data: MenuConditionInterface): boolean =>
            data.settings?.successors?.enable &&
            !data.signLater &&
            data.userSettings?.successors?.enable,
        },
        nameId: 'successors',
      },
      {
        label: 'EMPLOYEE_EVALUATION',
        routerLink: '/evaluation-manager',
        state: {
          getVisibility: (data: MenuConditionInterface): boolean =>
            data.settings?.evaluationManagement?.enable &&
            !data.signLater &&
            data.userSettings?.evaluationManagement?.enable,
        },
        nameId: 'evaluation-manager',
      },
    ],
  },
  {
    label: 'TITLE_GROUP_EMPLOYEE',
    icon: UserIcon,
    expanded: true,
    groupName: 'employee',
    state: {
      getVisibility: (data: MenuConditionInterface): boolean =>
        !!data.settings && !!data.currentUser,
    },
    items: [
      {
        label: 'TITLE_MY_ISSUES',
        routerLink: '/issues/list',
        styleClass: 'onb-step-menu-issues',
        routerLinkActiveOptions: {
          exact: false,
        },
        state: {
          getVisibility: (data: MenuConditionInterface): boolean =>
            data.settings?.issues?.enable &&
            !data.signLater &&
            data.userSettings?.issues?.enable,
          mobileIcon: '/assets/img/menu/my-issues.svg',
        },
        nameId: 'issues',
      },
      {
        label: 'TITLE_MY_DOCUMENTS',
        routerLink: '/my-documents',
        state: {
          getVisibility: (data: MenuConditionInterface): boolean =>
            data.settings?.myDocuments?.enable,
          mobileIcon: '/assets/img/menu/my-documents.svg',
        },
        nameId: 'myDocuments',
      },
      {
        label: 'TITLE_VACATIONS',
        routerLink: '/vacations',
        styleClass: 'onb-step-menu-vacations',
        state: {
          getVisibility: (data: MenuConditionInterface): boolean =>
            data.settings?.vacationSchedule?.enable &&
            !data.signLater &&
            data.userSettings?.vacationSchedule?.enable,
          mobileIcon: '/assets/img/menu/vacations.svg',
        },
        nameId: 'vacationSchedule',
      },
      {
        label: 'TITLE_TIMESHEET',
        routerLink: '/timesheet/my',
        state: {
          getVisibility: (data: MenuConditionInterface): boolean =>
            getTimesheetVisibility(data, 'myTimesheet'),
          mobileIcon: '/assets/img/menu/vacations-table.svg',
        },
        nameId: 'myTimesheet',
      },
      {
        label: 'TITLE_SALARY',
        routerLink: '/salaries',
        styleClass: 'onb-step-menu-salary',
        state: {
          getVisibility: (data: MenuConditionInterface): boolean =>
            data.settings?.payroll?.enable &&
            !data.signLater &&
            data.userSettings?.payroll?.enable,
          mobileIcon: '/assets/img/menu/salary.svg',
        },
        nameId: 'payroll',
      },
      {
        label: 'TITLE_INSURANCE',
        routerLink: '/my-insurance',
        state: {
          getVisibility: (data: MenuConditionInterface): boolean =>
            data.settings?.insurance?.enable &&
            !data.signLater &&
            data.userSettings?.insurance?.enable,
          mobileIcon: '/assets/img/menu/insurances.svg',
        },
        nameId: 'insurance',
      },
      {
        label: 'Карьера',
        routerLink: '/career',
        state: {
          getVisibility: (data: MenuConditionInterface): boolean =>
            data.settings.goals?.enable && data.userSettings?.goals?.enable && !data.signLater,
          mobileIcon: '/assets/img/menu/career.svg',
        },
        nameId: 'goals',
      },
      {
        label: 'TITLE_BUSINESS_TRIPS',
        routerLink: '/business-trip',
        state: {
          getVisibility: (data: MenuConditionInterface): boolean =>
            data.settings?.businessTrips?.enable &&
            !data.signLater &&
            data.userSettings?.businessTrips?.enable,
          mobileIcon: '/assets/img/menu/business-trips.svg',
        },
        nameId: 'businessTrips',
      },
      {
        label: 'TITLE_SURVEYS_MANAGEMENT',
        routerLink: '/surveys-management',
        state: {
          getVisibility: (data: MenuConditionInterface): boolean =>
            data.settings?.surveysManagement?.enable &&
            !data.signLater &&
            data.userSettings?.surveysManagement?.enable,
        },
        nameId: 'surveysManagement',
      },
      {
        label: 'TITLE_SURVEYS',
        routerLink: '/surveys-employee',
        state: {
          getVisibility: (data: MenuConditionInterface): boolean =>
            data.settings?.surveys?.enable &&
            !data.signLater &&
            data.userSettings?.surveys?.enable,
        },
        nameId: 'surveys',
      },
      {
        label: 'FEEDBACK',
        routerLink: '/feedback',
        state: {
          getVisibility: (data: MenuConditionInterface): boolean =>
            data.settings?.feedback?.enable &&
            !data.signLater &&
            data.userSettings?.feedback?.enable,
        },
        nameId: 'feedback',
      },
      {
        label: 'TITLE_COMPANY',
        routerLink: '/employees',
        state: {
          getVisibility: (data: MenuConditionInterface): boolean =>
            data.settings?.employees?.enable &&
            !data.signLater &&
            data.userSettings?.employees?.enable,
          mobileIcon: '/assets/img/menu/collegues.svg',
        },
        nameId: 'employees',
      },
      {
        label: 'TITLE_HR_PORTAL',
        routerLink: '/hr-presentation',
        state: {
          getVisibility: (data: MenuConditionInterface): boolean => {
            return (
              data.settings?.presentation?.enabled &&
              data.userSettings.presentation?.enable
            );
          },
          mobileIcon: '/assets/img/menu/vacations-table.svg',
        },
        nameId: 'presentation',
      },
    ],
  },
  {
    label: 'TITLE_MANAGE',
    icon: ShieldUserIcon,
    expanded: true,
    state: {
      getVisibility: (data: MenuConditionInterface): boolean => {
        const manageSectionTemplates =
          data.settings.manageSectionTemplates?.enable &&
          data.userSettings.manageSectionTemplates?.enable;
        const manageIssueTemplates =
          data.settings.manageIssueTemplates?.enable &&
          data.userSettings.manageIssueTemplates?.enable;
        return manageSectionTemplates || manageIssueTemplates;
      },
    },
    items: [
      {
        label: 'TITLE_MANAGE_ISSUE_TEMPLATES',
        routerLink: '/manage/issue-template',
        state: {
          getVisibility: (data: MenuConditionInterface): boolean =>
            data.settings.manageIssueTemplates?.enable &&
            data.userSettings.manageIssueTemplates?.enable && !data.signLater,
        },
        nameId: 'manageIssueTemplates',
      },
      {
        label: 'TITLE_MANAGE_SECTION_TEMPLATES',
        routerLink: '/manage/custom-sections',
        state: {
          getVisibility: (data: MenuConditionInterface): boolean =>
            data.settings.manageSectionTemplates?.enable &&
            data.userSettings.manageSectionTemplates?.enable && !data.signLater,
        },
        nameId: 'manageSectionTemplates',
      },
      {
        label: 'TITLE_NEWSLETTER_MANAGEMENT',
        routerLink: '/newsletter-management',
        icon: 'pi pi-send',
        state: {
          getVisibility: (data: MenuConditionInterface): boolean => 
            data.settings?.manageNewsletter?.enable &&
            data.userSettings?.manageNewsletter?.enable && !data.signLater,
        },
      },
    ],
  },
];

export const SIDEBAR_USER_MENU_ITEMS = [
  [
    {
      label: 'CONTACT_INFO',
      icon: UserIcon,
      iconType: 'lucide',
      routerLink: '/users/profile/info',
      state: {
        mobileIcon: '/assets/img/menu/contact-data.svg',
      },
      nameId: 'userProfile',
    },
    {
      label: 'ELECTRONIC_SIGNATURE',
      styleClass: 'onb-step-menu-check-square',
      routerLink: '/users/profile/signature',
      icon: SignatureIcon,
      iconType: 'lucide',
      state: {
        getVisibility: (data: MenuConditionInterface): boolean =>
          data.settings?.userProfile?.electronicSignature?.enable,
      },
      nameId: 'electronicSignature',
    },
    {
      label: 'AUTH_WAYS',
      routerLink: '/users/profile/magic-link',
      icon: QrCodeIcon,
      iconType: 'lucide',
      state: {
        getVisibility: (data: MenuConditionInterface): boolean =>
          data.settings?.userProfile?.useMagicLink,
      },
      nameId: 'useMagicLink',
    },
  ],
  [
    {
      label: 'APP_SETTINGS',
      routerLink: '/users/profile/settings',
      styleClass: 'cy-main-menu-settings',
      icon: SettingsIcon,
      iconType: 'lucide',
      state: {
        getVisibility: (data: MenuConditionInterface): boolean => {
          let hasVisibleWidget = false;
          for (const key in data.userSettings?.dashboard) {
            if (
              data.userSettings.dashboard[key] &&
              data.userSettings.dashboard[key].visible
            ) {
              hasVisibleWidget = true;
            }
          }
          return (
            !data.signLater &&
            data.settings?.userProfile?.appSettings?.enable &&
            hasVisibleWidget
          );
        },
        nameId: 'settings',
      },
    },
    {
      label: 'TITLE_SUPPORT',
      routerLink: '/support',
      icon: MessageCircleIcon,
      iconType: 'lucide',
      state: {
        getVisibility: (data: MenuConditionInterface): boolean =>
          data.settings?.support?.enable &&
          !data.signLater &&
          data.userSettings?.support?.enable,
        mobileIcon: '/assets/img/menu/support.svg',
      },
      nameId: 'support',
    },
  ],
  [
    {
      label: 'CHANGE_PASSWORD',
      routerLink: '/users/profile/password',
      icon: KeyIcon,
      iconType: 'lucide',
      state: {
        getVisibility: (data: MenuConditionInterface): boolean =>
          data.authType && data.settings?.userProfile?.changePassword?.enable,
      },
      nameId: 'changePassword',
    },
  ],
];

const getTimesheetVisibility = (
  data: MenuConditionInterface,
  section: 'myTimesheet' | 'teamTimesheet',
): boolean => {
  const settingsEnabled = data.settings?.[section]?.enable;
  if (!settingsEnabled) {
    return false;
  }

  const userSettingsItem = data.userSettings?.[section];
  return userSettingsItem ? userSettingsItem.enable : true;
};

const getVisibilityManager = (data: MenuConditionInterface): boolean => {
  return (
    (data.settings?.myTeam?.enable && data.userSettings?.myTeam?.enable) ||
    (data.settings?.employeesVacations?.enable &&
      data.userSettings?.employeesVacations?.enable) ||
    (data.settings?.employeeDocuments?.enable &&
      data.userSettings?.employeeDocuments?.enable) ||
    (data.settings?.employeeRequests?.enable &&
      data.userSettings?.employeeRequests?.enable) ||
    (data.settings?.managerDocuments?.enable &&
      data.userSettings?.managerDocuments?.enable) ||
    (data.settings?.vacationBalances?.enable &&
      data.userSettings?.vacationBalances?.enable) ||
    getTimesheetVisibility(data, 'teamTimesheet') ||
    data.userSettings?.employeeBusinessTrips?.enable ||
    (data.settings?.feedbackManagement?.enable &&
      data.userSettings?.feedbackManagement?.enable) ||
    (data.settings?.talents?.enable && data.userSettings?.talents?.enable) ||
    (data.settings?.successors?.enable &&
      data.userSettings?.successors?.enable) ||
    (data.settings?.evaluationManagement?.enable &&
      data.userSettings?.evaluationManagement?.enable)
  );
};
