import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../shared/guards/auth.guard';
import { FeedbackContainerComponent } from '@features/feedback/containers/feedback-container/feedback-container.component';
import { FeedbackItemContainerComponent } from '@features/feedback/containers/feedback-item-container/feedback-item-container.component';

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
        component: FeedbackContainerComponent,
        data: {
          title: 'FEEDBACK',
        },
      },
      {
        path: ':id',
        component: FeedbackItemContainerComponent,
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
export class FeedbackRoutingModule {}
