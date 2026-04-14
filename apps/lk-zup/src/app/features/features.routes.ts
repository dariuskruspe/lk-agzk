import { AuthGuard } from '../shared/guards/auth.guard';
import { VisibilityGuard } from '../shared/guards/visiblility.guard';
import { EmptyReloadingPageComponent } from './main/components/empty-reloading-page/empty-reloading-page.component';
import { Routes } from '@angular/router';

import DashboardV2Component from './dashboard_v2/dashboard-v2.component';

export default [
  {
    path: 'manage',
    data: {
      fullContent: true,
      dockyEnabled: false,
    },
    loadChildren: () => import('./manage/admin.routes'),
  },

  {
    path: '',
    canActivate: [AuthGuard, VisibilityGuard],
    data: {
      isDashboardPage: true,
    },
    loadComponent: () => import('./dashboard_v2/dashboard-v2.component'),
  },

  {
    path: 'issues',
    canActivate: [AuthGuard, VisibilityGuard],
    canActivateChild: [VisibilityGuard],
    data: {
      title: 'TITLE_MY_ISSUES',
      breadcrumb: 'TITLE_MY_ISSUES',
    },
    loadChildren: () =>
      import('./issues/issues.module').then((m) => m.IssuesModule),
  },
  {
    path: 'issues-management',
    canActivate: [AuthGuard, VisibilityGuard],
    canActivateChild: [VisibilityGuard],
    loadChildren: () =>
      import('./issues-management/issues-management.module').then(
        (m) => m.IssuesManagementModule,
      ),
  },
  {
    path: 'employees',
    canActivate: [AuthGuard, VisibilityGuard],
    canActivateChild: [VisibilityGuard],
    loadChildren: () =>
      import('./employees/employees.module').then((m) => m.EmployeesModule),
  },
  {
    path: 'users',
    canActivate: [VisibilityGuard],
    loadChildren: () =>
      import('./users/users.module').then((m) => m.UsersModule),
    data: {
      title: 'TITLE_PROFILE',
      breadcrumb: 'TITLE_PROFILE',
    },
  },
  {
    path: 'my-insurance',
    canActivate: [VisibilityGuard],
    loadChildren: () =>
      import('./insurance/insurance.module').then((m) => m.InsuranceModule),
    data: {
      title: 'TITLE_MY_INSURANCE',
      breadcrumb: 'BREADCRUMBS_INSURANCE',
    },
  },
  {
    path: 'support',
    loadChildren: () =>
      import('./support/support.module').then((m) => m.SupportModule),
    data: {
      title: 'TITLE_SUPPORT',
      breadcrumb: 'BREADCRUMBS_SUPPORT',
    },
  },
  {
    path: 'vacations',
    canActivate: [VisibilityGuard],
    loadChildren: () =>
      import('./vacations/vacations.module').then((m) => m.VacationsModule),
  },
  {
    path: 'vacations-employee',
    canActivate: [VisibilityGuard],
    canActivateChild: [VisibilityGuard],
    loadChildren: () =>
      import('./vacations-employee/vacations-employee.module').then(
        (m) => m.VacationsEmployeeModule,
      ),
  },
  {
    path: 'vacations-management',
    canActivate: [VisibilityGuard],
    loadChildren: () =>
      import('./vacations/vacations.module').then((m) => m.VacationsModule),
  },
  {
    path: 'timesheet',
    canActivate: [AuthGuard],
    loadChildren: () => import('./timesheet/timesheet.routes'),
    data: {
      title: 'TITLE_TIMESHEET',
      breadcrumb: 'TITLE_TIMESHEET',
    },
  },
  {
    path: 'documents',
    canActivate: [AuthGuard, VisibilityGuard],
    canActivateChild: [VisibilityGuard],
    loadChildren: () =>
      import('./agreements/agreements.module').then((m) => m.AgreementsModule),
  },
  {
    path: 'my-documents',
    canActivate: [AuthGuard, VisibilityGuard],
    loadChildren: () =>
      import('./agreements/agreements.module').then((m) => m.AgreementsModule),
  },
  {
    path: 'documents-employee',
    canActivate: [AuthGuard, VisibilityGuard],
    loadChildren: () =>
      import('./agreements-employee/agreements-employee.module').then(
        (m) => m.AgreementsEmployeeModule,
      ),
  },
  {
    path: 'business-trip',
    canActivate: [VisibilityGuard],
    canActivateChild: [VisibilityGuard],
    loadChildren: () =>
      import('./business-trips/business-trips.module').then(
        (m) => m.BusinessTripSModule,
      ),
    data: {
      title: 'TITLE_BUSINESS_TRIPS',
      breadcrumb: 'TITLE_BUSINESS_TRIPS',
    },
  },
  {
    path: 'employee-business-trip',
    canActivate: [VisibilityGuard],
    canActivateChild: [VisibilityGuard],
    loadChildren: () =>
      import('./business-trips/business-trips.module').then(
        (m) => m.BusinessTripSModule,
      ),
    data: {
      title: 'TITLE_BUSINESS_TRIPS',
      breadcrumb: 'TITLE_BUSINESS_TRIPS',
    },
  },
  {
    path: 'feedback-management',
    canActivate: [VisibilityGuard],
    canActivateChild: [VisibilityGuard],
    loadChildren: () =>
      import('./feedback-management/feedback-management.module').then(
        (m) => m.FeedbackManagementModule,
      ),
    data: {
      title: 'FEEDBACK',
      breadcrumb: 'FEEDBACK',
    },
  },
  {
    path: 'surveys-management',
    canActivate: [VisibilityGuard],
    canActivateChild: [VisibilityGuard],
    loadChildren: () =>
      import('./surveys-management/surveys-management.module').then(
        (m) => m.SurveysManagementModule,
      ),
    data: {
      title: 'TITLE_SURVEYS_MANAGEMENT',
      breadcrumb: 'TITLE_SURVEYS_MANAGEMENT',
    },
  },
  {
    path: 'custom',
    loadChildren: () =>
      import('./custom-page/custom-page.module').then(
        (m) => m.CustomPageModule,
      ),
  },
  {
    path: 'surveys-employee',
    canActivate: [VisibilityGuard],
    canActivateChild: [VisibilityGuard],
    loadChildren: () =>
      import('./surveys-employee/surveys-employee.module').then(
        (m) => m.SurveysEmployeeModule,
      ),
    data: {
      title: 'TITLE_SURVEYS',
      breadcrumb: 'TITLE_SURVEYS',
    },
  },
  {
    path: 'feedback',
    canActivate: [VisibilityGuard],
    canActivateChild: [VisibilityGuard],
    loadChildren: () =>
      import('./feedback/feedback.module').then((m) => m.FeedbackModule),
    data: {
      title: 'FEEDBACK',
      breadcrumb: 'FEEDBACK',
    },
  },
  {
    path: 'talents',
    canActivate: [VisibilityGuard],
    canActivateChild: [VisibilityGuard],
    loadChildren: () =>
      import('./talents/talents.module').then((m) => m.TalentsModule),
    data: {
      title: 'TALENTS',
      breadcrumb: 'TALENTS',
    },
  },
  {
    path: 'successors',
    canActivate: [VisibilityGuard],
    canActivateChild: [VisibilityGuard],
    loadChildren: () =>
      import('./successors/successors.module').then((m) => m.SuccessorsModule),
    data: {
      title: 'SUCCESSORS',
      breadcrumb: 'SUCCESSORS',
    },
  },
  {
    path: 'hr-presentation',
    loadChildren: () =>
      import('./hr-presentation/hr-presentation.module').then(
        (m) => m.HrPresentationModule,
      ),
  },
  {
    path: 'empty_reloading_page',
    component: EmptyReloadingPageComponent,
  },

  {
    path: 'career',
    loadChildren: () => import('./career/career.routes'),
  },
  {
    path: 'my-team',
    loadChildren: () => import('./my-team/my-team.routes'),
  },
  {
    path: 'evaluation-manager',
    loadChildren: () => import('./career/evaluation-manager.routes'),
  },
  {
    path: 'newsletter-management',
    canActivate: [VisibilityGuard],
    canActivateChild: [VisibilityGuard],
    loadChildren: () =>
      import('./newsletter-management/newsletter-management.module').then(
        (m) => m.NewsletterManagementModule,
      ),
    data: {
      title: 'NEWSLETTER_MANAGEMENT',
      breadcrumb: 'NEWSLETTER_MANAGEMENT',
    },
  },
  {
    path: 'salaries',
    loadChildren: () =>
      import('./salaries/salaries.module').then((m) => m.SalariesModule),
  },

  {
    path: 'v2',
    children: [
      {
        path: 'dashboard',
        canActivate: [VisibilityGuard],
        data: {
          isDashboardPage: true,
        },
        component: DashboardV2Component,
      },

      {
        path: 'vacations',
        canActivate: [VisibilityGuard],
        loadChildren: () => import('./vacations_v2/vacations_v2.routes'),
      },
      {
        path: 'vacations-management',
        canActivate: [VisibilityGuard],
        loadChildren: () =>
          import('./vacations-management_v2/vacations-management_v2.routes'),
      },
      {
        path: 'business-trip',
        canActivate: [VisibilityGuard],
        loadChildren: () =>
          import('./business-trip_v2/business-trip_v2.routes'),
      },
      {
        path: 'employee-business-trip',
        canActivate: [VisibilityGuard],
        loadChildren: () =>
          import('./business-trip_v2/employee-business-trip_v2.routes'),
      },
    ],
  },
] as Routes;
