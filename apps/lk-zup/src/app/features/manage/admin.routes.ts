import { Routes } from '@angular/router';
import { ManageLayoutComponent } from './manage-layout/manage-layout.component';

export default [
  {
    path: '',
    component: ManageLayoutComponent,
    children: [
      {
        path: 'issue-template',
        loadChildren: () =>
          import('./features/issue-template/issue-template.routes'),
      },
      {
        path: 'custom-sections',
        loadChildren: () =>
          import('./features/custom-sections/custom-section.routes'),
      },
    ],
  },
] as Routes;
