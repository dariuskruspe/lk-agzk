import { Routes } from '@angular/router';
import { CareerComponent } from '@features/career/career.component';

export default [
  {
    path: '',
    component: CareerComponent,
    children: [
      {
        path: 'goals',
        loadComponent: () =>
          import('./goals/goals.component').then((i) => i.GoalsComponent),
      },
      { path: '', pathMatch: 'full', redirectTo: 'goals' },
      {
        path: 'evaluation',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./evaluation/evaluation-container.component').then((i) => i.EvaluationContainerComponent),
          },
        ]
      },
      {
        path: 'evaluation-archive',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./evaluation/evaluation-container.component').then((i) => i.EvaluationContainerComponent),
          },
        ]
      },
    ],
  },
  {
    path: 'evaluation/:id',
    loadComponent: () => import('./evaluation/components/evaluation-item-container/evaluation-item-container.component').then((i) => i.EvaluationItemContainerComponent),
  },
  {
    path: 'evaluation-manager',
    loadComponent: () => import('./evaluation-manager/evaluation-manager-container.component').then((i) => i.EvaluationManagerContainerComponent),
  },
  {
    path: 'evaluation-manager/:id',
    loadComponent: () => import('./evaluation-manager/components/evaluation-manager-item-container/evaluation-manager-item-container.component').then((i) => i.EvaluationManagerItemContainerComponent),
  },
] as Routes;
