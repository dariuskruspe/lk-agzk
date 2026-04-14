import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IssuesEmailApprovalContainerComponent } from './containers/issues-email-approval-container/issues-email-approval-container.component';

const routes: Routes = [
  {
    path: '',
    component: IssuesEmailApprovalContainerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IssuesApprovalRoutingModule {}
