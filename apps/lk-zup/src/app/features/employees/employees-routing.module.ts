import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeesListContainerComponent } from './containers/employees-list-container/employees-list-container.component';
import { EmployeesShowContainerComponent } from './containers/employees-show-container/employees-show-container.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'TITLE_COMPANY',
    },
    children: [
      {
        path: '',
        component: EmployeesListContainerComponent,
      },
      {
        path: ':id',
        component: EmployeesShowContainerComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeesRoutingModule {}
