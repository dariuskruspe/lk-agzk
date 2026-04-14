import { of } from 'rxjs';
import { MainBreadcrumbsInterface } from '../models/main-breadcrumbs.interface';

export const ZERO_BREADCRUMBS: MainBreadcrumbsInterface[] = [
  {
    label: of('TITLE_DASHBOARD'),
    depth: 0,
    url: '/',
  },
  {
    label: of('TITLE_ISSUES_MANAGEMENT'),
    depth: 0,
    url: '/issues-management',
  },
  {
    label: of('TITLE_COLLEAGUE_STATUSES'),
    depth: 0,
    url: '/employees',
  },
  {
    label: of('TITLE_VACATIONS'),
    depth: 0,
    url: '/vacations',
  },
  {
    label: of('TITLE_TIMESHEET'),
    depth: 0,
    url: '/timesheet',
  },
  {
    label: of('TITLE_MY_ISSUES'),
    depth: 0,
    url: '/issues',
  },
  {
    label: of('TITLE_DOCUMENTS'),
    depth: 0,
    url: '/documents',
  },
  {
    label: of('TITLE_MY_INSURANCE'),
    depth: 0,
    url: '/my-insurance',
  },
  {
    label: of('TITLE_SUPPORT'),
    depth: 0,
    url: '/support',
  },
  {
    label: of('TITLE_SALARY'),
    depth: 0,
    url: '/salaries',
  },
  {
    label: of('TITLE_BUSINESS_TRIPS'),
    depth: 0,
    url: '/business-trip',
  },
  {
    label: of('CONTACT_INFO'),
    depth: 0,
    url: '/users/profile/info',
  },
  {
    label: of('CHANGE_PASSWORD'),
    depth: 0,
    url: '/users/profile/password',
  },
  {
    label: of('ELECTRONIC_SIGNATURE'),
    depth: 0,
    url: '/users/profile/signature',
  },
  {
    label: of('AUTH_WAYS'),
    depth: 0,
    url: '/users/profile/magic-link',
  },
  {
    label: of('APP_SETTINGS'),
    depth: 0,
    url: '/users/profile/settings',
  },
];
