import { MainCurrentUserInterface } from '@features/main/models/main-current-user.interface';
import { SettingsInterface } from '../features/settings/models/settings.interface';

export interface MenuConditionInterface {
  settings: SettingsInterface;
  signLater: boolean;
  currentUser: MainCurrentUserInterface;
  authType: boolean;
  userSettings: UserSettingsInterface;
}
export interface UserSettingsInterface {
  issues: {
    id: string;
    name: string;
    enable: boolean;
    issuesForEmployees: MenuItemInterface;
    synonyms: { [key: string]: string }[];
  };
  businessTrips: {
    id: string;
    name: string;
    enable: boolean;
    businessTripsIssues: WidgetDashboardInterface;
    synonyms: { [key: string]: string }[];
  };
  insurance: MenuItemInterface;
  managerDocuments: MenuItemInterface;
  dashboard: DashboardMenuItemInterface;
  employeeRequests: MenuItemInterface;
  employees: MenuItemInterface;
  employeesVacations: MenuItemInterface;
  vacationBalances: MenuItemInterface;
  headers: MenuItemInterface;
  myDocuments: MenuItemInterface;
  employeeDocuments: MenuItemInterface;
  payroll: MenuItemInterface;
  presentation: MenuItemInterface;
  support: MenuItemInterface;
  userProfile: MenuItemInterface;
  myTeam: MenuItemInterface;
  myTimesheet?: MenuItemInterface;
  teamTimesheet?: MenuItemInterface;
  vacationSchedule: MenuItemInterface;
  employeeBusinessTrips: MenuItemInterface;
  goals: MenuItemInterface;
  surveysManagement: MenuItemInterface;
  surveys: MenuItemInterface;
  custom: CustomMenuItemInterface[];
  feedback: MenuItemInterface;
  feedbackManagement: MenuItemInterface;
  talents: MenuItemInterface;
  successors: MenuItemInterface;
  evaluation?: MenuItemInterface;
  evaluationManagement?: MenuItemInterface;
  manageIssueTemplates: MenuItemInterface;
  manageSectionTemplates: MenuItemInterface;
  manageNewsletter: MenuItemInterface;
}

export interface MenuItemInterface {
  id: string;
  name: string;
  enable: boolean;
  synonyms: { [key: string]: string }[];
  newVersion?: boolean;
}
export interface CustomMenuItemInterface {
  id: string;
  name: string;
  enable: boolean;
  visible: boolean;
  order: number;
  iconName: string;
  description: string;
  synonyms: string[];
  parent: 'employee' | 'manager' | 'profile';
}
export interface DashboardMenuItemInterface {
  dashboard_customReports: WidgetDashboardInterface;
  dashboard_documents: WidgetDashboardInterface;
  dashboard_payroll: WidgetDashboardInterface;
  dashboard_requests: WidgetDashboardInterface;
  dashboard_status: WidgetDashboardInterface;
  dashboard_vacations: WidgetDashboardInterface;
  dashboard_employeeRequests: WidgetDashboardInterface;
  description: string;
  enable: boolean;
  iconName: string;
  id: string;
  name: string;
  order: number;
  visible: boolean;
  hasCustomWidgets?: boolean;
}
export interface WidgetDashboardInterface {
  description: string;
  enable: boolean;
  iconName: string;
  id: string;
  name: string;
  order: number;
  visible: boolean;
}
