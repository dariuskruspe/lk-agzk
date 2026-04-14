import { MenuItem } from 'primeng/api';
import { MenuConditionInterface } from '../../../shared/models/menu-condition.interface';

export const MENU_ITEMS: MenuItem[] = [
  {
    label: 'TITLE_DASHBOARD',
    icon: 'hrm-icons icon-home',
    styleClass: 'cy-main-menu-dashboard',
    routerLink: '/',
    routerLinkActiveOptions: {
      queryParams: 'ignored',
      paths: 'exact',
    },
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
    icon: 'hrm-icons icon-manager',
    expanded: true,
    state: {
      getVisibility: (data: MenuConditionInterface): boolean =>
        !data.signLater && getVisibilityManager(data),
    },
    items: [
      {
        label: 'TITLE_MY_TEAMS',
        routerLink: '/my-team',
        icon: 'hrm-icons icon-my-team',
        state: {
          getVisibility: (data: MenuConditionInterface): boolean =>
            data.settings?.myTeam?.enable && data.userSettings?.myTeam?.enable,
          mobileIcon: '/assets/img/menu/my-team.svg',
        },
        nameId: 'myTeam',
      },
      {
        label: 'TITLE_DOCUMENTS_EMPLOYEE',
        routerLink: '/documents-employee',
        icon: 'hrm-icons icon-assignment',
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
        icon: 'hrm-icons icon-list',
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
        icon: 'hrm-icons icon-assignment',
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
        icon: 'hrm-icons icon-gant',
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
        icon: 'hrm-icons icon-calendar',
        state: {
          getVisibility: (data: MenuConditionInterface): boolean =>
            data.settings?.vacationBalances?.enable &&
            data?.userSettings?.vacationBalances?.enable,
          mobileIcon: '/assets/img/menu/vacations-table.svg',
        },
        nameId: 'vacationBalances',
      },
      {
        label: 'TITLE_TIMESHEET',
        routerLink: '/timesheet/team',
        icon: 'hrm-icons icon-calendar',
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
        icon: 'hrm-icons icon-plane',
        state: {
          getVisibility: (data: MenuConditionInterface): boolean =>
            data?.userSettings?.employeeBusinessTrips?.enable,
          mobileIcon: '/assets/img/menu/business-trips.svg',
        },
        nameId: 'employeeBusinessTrips',
      },
      {
        label: 'FEEDBACK',
        routerLink: '/feedback-management',
        icon: 'pi pi-clipboard',
        state: {
          getVisibility: (data: MenuConditionInterface): boolean =>
            data.settings?.feedbackManagement?.enable &&
            !data.signLater &&
            data.userSettings?.feedbackManagement?.enable,
        },
        nameId: 'feedbackManagement',
      },
      {
        label: 'TALENTS',
        routerLink: '/talents',
        icon: 'pi pi-star',
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
        icon: 'pi pi-user-plus',
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
        icon: 'pi pi-book',
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
    icon: 'hrm-icons icon-profile',
    expanded: true,
    state: {
      getVisibility: (data: MenuConditionInterface): boolean =>
        !!data.settings && !!data.currentUser,
    },
    items: [
      {
        label: 'TITLE_MY_ISSUES',
        icon: 'hrm-icons icon-issues',
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
        icon: 'hrm-icons icon-doc',
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
        icon: 'hrm-icons icon-gant',
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
        icon: 'hrm-icons icon-calendar',
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
        icon: 'hrm-icons icon-wallet',
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
        icon: 'hrm-icons icon-insurance',
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
        icon: 'hrm-icons icon-career',
        state: {
          getVisibility: (data: MenuConditionInterface): boolean =>
            data.settings.goals?.enable && data.userSettings?.goals?.enable,
          mobileIcon: '/assets/img/menu/career.svg',
        },
        nameId: 'goals',
      },
      {
        label: 'TITLE_BUSINESS_TRIPS',
        routerLink: '/business-trip',
        icon: 'hrm-icons icon-plane',
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
        icon: 'pi pi-pen-to-square',
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
        icon: 'pi pi-pen-to-square',
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
        icon: 'pi pi-clipboard',
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
        icon: 'hrm-icons icon-company',
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
        icon: 'hrm-icons icon-office',
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
    icon: 'pi pi-cog',
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
        icon: 'pi pi-hammer',
        state: {
          getVisibility: (data: MenuConditionInterface): boolean =>
            data.settings.manageIssueTemplates?.enable &&
            data.userSettings.manageIssueTemplates?.enable,
        },
      },
      {
        label: 'TITLE_MANAGE_SECTION_TEMPLATES',
        routerLink: '/manage/custom-sections',
        icon: 'pi pi-bookmark',
        state: {
          getVisibility: (data: MenuConditionInterface): boolean =>
            data.settings.manageSectionTemplates?.enable &&
            data.userSettings.manageSectionTemplates?.enable,
        },
      },
      {
        label: 'TITLE_NEWSLETTER_MANAGEMENT',
        routerLink: '/newsletter-management',
        icon: 'pi pi-send',
        state: {
          getVisibility: (data: MenuConditionInterface): boolean => 
            data.userSettings?.manageNewsletter?.enable,
        },
      },
    ],
  },
  {
    label: 'TITLE_PROFILE',
    icon: 'hrm-icons icon-contacts',
    expanded: true,
    state: {
      getVisibility: (data: MenuConditionInterface): boolean =>
        !!data.settings && !!data.currentUser,
    },
    items: [
      {
        label: 'CONTACT_INFO',
        icon: 'pi pi-id-card',
        routerLink: '/users/profile/info',
        state: {
          mobileIcon: '/assets/img/menu/contact-data.svg',
        },
        nameId: 'userProfile',
      },
      {
        label: 'CHANGE_PASSWORD',
        icon: 'pi pi-key',
        routerLink: '/users/profile/password',
        state: {
          getVisibility: (data: MenuConditionInterface): boolean =>
            data.authType && data.settings?.userProfile?.changePassword?.enable,
          mobileIcon: '/assets/img/menu/password.svg',
        },
        nameId: 'changePassword',
      },
      {
        label: 'ELECTRONIC_SIGNATURE',
        icon: 'pi pi-check-square',
        styleClass: 'onb-step-menu-check-square',
        routerLink: '/users/profile/signature',
        state: {
          getVisibility: (data: MenuConditionInterface): boolean =>
            data.settings?.userProfile?.electronicSignature?.enable,
          mobileIcon: '/assets/img/menu/signatures.svg',
        },
        nameId: 'electronicSignature',
      },
      {
        label: 'AUTH_WAYS',
        icon: 'hrm-icons icon-qr',
        routerLink: '/users/profile/magic-link',
        state: {
          getVisibility: (data: MenuConditionInterface): boolean =>
            data.settings?.userProfile?.useMagicLink,
          mobileIcon: '/assets/img/menu/qr.svg',
        },
        nameId: 'useMagicLink',
      },
      {
        label: 'APP_SETTINGS',
        icon: 'pi pi-cog',
        routerLink: '/users/profile/settings',
        styleClass: 'cy-main-menu-settings',
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
          mobileIcon: '/assets/img/menu/settings.svg',
          nameId: 'settings',
        },
      },
      {
        label: 'TITLE_SUPPORT',
        icon: 'hrm-icons icon-support',
        routerLink: '/support',
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
  },
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
