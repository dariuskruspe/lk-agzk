import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../shared/guards/auth.guard';
import { IssuesAddContainerComponent } from '../issues/containers/issues-add-container/issues-add-container.component';
import { IssuesShowContainerComponent } from '../issues/containers/issues-show-container/issues-show-container.component';
import { BusinessTripsDashboardContainerComponent } from './containers/business-trips-list-dashboard-container/business-trips-dashboard-container.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: BusinessTripsDashboardContainerComponent,
  },
  {
    path: 'create/:alias',
    component: IssuesAddContainerComponent,
    data: {
      title: 'TITLE_ISSUE_CREATE',
    },
  },
  {
    path: ':id',
    canActivate: [AuthGuard],
    component: IssuesShowContainerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BusinessTripsRoutingModule {}
