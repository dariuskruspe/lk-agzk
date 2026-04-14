import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../shared/guards/auth.guard';
import { IssuesShowContainerComponent } from '../issues/containers/issues-show-container/issues-show-container.component';
import { InsuranceContainerComponent } from './containers/insurance-container/insurance-container.component';
import { InsuranceIssuesContainerComponent } from './containers/insurance-issues-container/insurance-issues-container.component';

const routes: Routes = [
  {
    path: '',
    component: InsuranceContainerComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'insurance-issues',
    children: [
      {
        path: '',
        component: InsuranceIssuesContainerComponent,
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
export class InsuranceRoutingModule {}
