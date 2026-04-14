import { Routes } from '@angular/router';
import { CareerComponent } from '@features/career/career.component';
import {
  EvaluationManagerContainerComponent
} from "@features/career/evaluation-manager/evaluation-manager-container.component";

export default [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./evaluation-manager/evaluation-manager-container.component').then((i) => i.EvaluationManagerContainerComponent),
      },
      {
        path: ':employeeId',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./evaluation-manager/components/evaluation-manager-item-container/evaluation-manager-item-container.component').then((i) => i.EvaluationManagerItemContainerComponent),
          },
        ]
      },
      {
        path: ':employeeId/:id',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./evaluation/components/evaluation-item-container/evaluation-item-container.component').then((i) => i.EvaluationItemContainerComponent),
          },
        ]
      },
    ],
  },
] as Routes;
