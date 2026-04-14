import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../shared/guards/auth.guard';
import {
  SurveysEmployeeContainerComponent
} from "@features/surveys-employee/containers/surveys-employee-container/surveys-employee-container.component";
import {
  SurveysEmployeeItemContainerComponent
} from "@features/surveys-employee/containers/surveys-employee-item-container/surveys-employee-item-container.component";

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'TITLE_SURVEYS_MANAGEMENT',
    },
    children: [
      {
        path: '',
        component: SurveysEmployeeContainerComponent,
        data: {
          title: 'TITLE_SURVEYS_MANAGEMENT',
        },
      },
      {
        path: ':id',
        component: SurveysEmployeeItemContainerComponent,
        data: {
          title: 'TITLE_SURVEYS_MANAGEMENT',
        },
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SurveysEmployeeRoutingModule {}
