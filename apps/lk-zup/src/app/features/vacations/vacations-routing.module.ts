import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../shared/guards/auth.guard';
import { VacationsGraphContainerComponent } from './containers/vacations-graph-container/vacations-graph-container.component';

const routes: Routes = [
  {
    path: '',
    component: VacationsGraphContainerComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'TITLE_VACATIONS',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VacationsRoutingModule {}
