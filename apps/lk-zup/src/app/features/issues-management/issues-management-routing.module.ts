import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IssuesShowContainerComponent } from '../issues/containers/issues-show-container/issues-show-container.component';
import { IssuesManagementListContainerComponent } from './containers/issues-management-list-container/issues-management-list-container.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'TITLE_ISSUES_MANAGEMENT',
    },
    children: [
      {
        path: '',
        component: IssuesManagementListContainerComponent,
      },
      {
        path: ':id',
        component: IssuesShowContainerComponent,
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IssuesManagementRoutingModule {}
