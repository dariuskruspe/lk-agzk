import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../shared/guards/auth.guard';
import {
  SuccessorsContainerComponent
} from '@features/successors/containers/successors-container/successors-container.component';
import {
  SuccessorsItemContainerComponent
} from '@features/successors/containers/successors-item-container/successors-item-container.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'SUCCESSORS',
    },
    children: [
      {
        path: '',
        component: SuccessorsContainerComponent,
        data: {
          title: 'SUCCESSORS',
        },
      },
      {
        path: ':id',
        component: SuccessorsItemContainerComponent,
        data: {
          title: 'SUCCESSORS',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SuccessorsRoutingModule {}
