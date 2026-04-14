import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../shared/guards/auth.guard';
import { VacationsEmployeeContainerComponent } from './containers/vacations-employee-container/vacations-employee-container.component';

const routes: Routes = [
  {
    path: '',
    component: VacationsEmployeeContainerComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'TITLE_VACATIONS_EMPLOYEE',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VacationsEmployeeRoutingModule {}
