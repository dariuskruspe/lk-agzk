import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../shared/guards/auth.guard';
import { IssuesShowContainerComponent } from '../issues/containers/issues-show-container/issues-show-container.component';
import { SalariesDashboardContainerComponent } from './containers/salaries-dashboard-container/salaries-dashboard-container.component';
import { SalariesIncomeDetailsContainerComponent } from './containers/salaries-income-details-container/salaries-income-details-container.component';
import { SalariesSalariesDetailsContainerComponent } from './containers/salaries-salaries-details-container/salaries-salaries-details-container.component';
import { SalariesTaxListContainerComponent } from './containers/salaries-tax-list-container/salaries-tax-list-container.component';

const routes: Routes = [
  {
    path: '',
    component: SalariesDashboardContainerComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'BREADCRUMBS_SALARY',
    },
  },
  {
    path: 'payroll',
    component: SalariesSalariesDetailsContainerComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'BREADCRUMBS_SALARY',
    },
  },
  {
    path: 'income',
    component: SalariesIncomeDetailsContainerComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'BREADCRUMBS_SALARY',
    },
  },
  {
    path: 'tax',
    canActivate: [AuthGuard],
    data: {
      title: 'BREADCRUMBS_SALARY',
    },
    children: [
      {
        path: '',
        component: SalariesTaxListContainerComponent,
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
export class SalariesRoutingModule {}
