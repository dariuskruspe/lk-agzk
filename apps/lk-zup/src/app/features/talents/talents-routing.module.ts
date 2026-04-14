import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../shared/guards/auth.guard';
import { TalentsContainerComponent } from '@features/talents/containers/talents-container/talents-container.component';
import { TalentsItemContainerComponent } from '@features/talents/containers/talents-item-container/talents-item-container.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'TALENTS',
    },
    children: [
      {
        path: '',
        component: TalentsContainerComponent,
        data: {
          title: 'TALENTS',
        },
      },
      {
        path: ':id',
        component: TalentsItemContainerComponent,
        data: {
          title: 'TALENTS',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TalentsRoutingModule {}
