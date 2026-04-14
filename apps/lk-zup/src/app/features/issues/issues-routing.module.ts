import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../shared/guards/auth.guard';
import { IssuesAddContainerComponent } from './containers/issues-add-container/issues-add-container.component';
import { IssuesAddStaticContainerComponent } from './containers/issues-add-static-container/issues-add-static-container.component';
import { IssuesListDashboardContainerComponent } from './containers/issues-list-dashboard-container/issues-list-dashboard-container.component';
import { IssuesShowContainerComponent } from './containers/issues-show-container/issues-show-container.component';
import { IssuesTypeListContainerComponent } from './containers/issues-type-list-container/issues-type-list-container.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
  {
    path: 'list',
    children: [
      {
        path: '',
        component: IssuesListDashboardContainerComponent,
        canActivate: [AuthGuard],
      },
      {
        path: ':id',
        component: IssuesShowContainerComponent,
      },
    ],
  },
  {
    path: 'types',
    canActivate: [AuthGuard],
    data: {
      title: 'TITLE_ISSUE_CREATE',
    },
    children: [
      {
        path: '',
        component: IssuesTypeListContainerComponent,
      },
      {
        path: ':id',
        component: IssuesAddContainerComponent,
        data: {
          title: 'TITLE_ISSUE_CREATE',
        },
      },
      {
        path: ':alias/alias',
        component: IssuesAddContainerComponent,
        data: {
          title: 'TITLE_ISSUE_CREATE',
        },
      },
      {
        path: ':alias/custom',
        component: IssuesAddStaticContainerComponent,
        data: {
          title: 'TITLE_ISSUE_CREATE',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IssuesRoutingModule {}
