import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../shared/guards/auth.guard';
import { FeedbackManagementContainerComponent } from '@features/feedback-management/containers/feedback-management-container/feedback-management-container.component';
import { FeedbackManagementItemContainerComponent } from '@features/feedback-management/containers/feedback-management-item-container/feedback-management-item-container.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'FEEDBACK',
    },
    children: [
      {
        path: '',
        component: FeedbackManagementContainerComponent,
        data: {
          title: 'FEEDBACK',
        },
      },
      {
        path: ':id',
        component: FeedbackManagementItemContainerComponent,
        data: {
          title: 'FEEDBACK',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeedbackManagementRoutingModule {}
