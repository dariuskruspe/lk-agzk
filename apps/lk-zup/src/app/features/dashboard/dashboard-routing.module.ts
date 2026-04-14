import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../shared/guards/auth.guard';
import { DashboardMainContainerComponent } from './containers/dashboard-main-container/dashboard-main-container.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardMainContainerComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
