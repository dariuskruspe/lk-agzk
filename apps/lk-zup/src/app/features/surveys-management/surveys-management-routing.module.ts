import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../shared/guards/auth.guard';
import {
  SurveysManagementContainerComponent
} from "@features/surveys-management/containers/surveys-management-container/surveys-management-container.component";
import {
  SurveysManagementCreateContainerComponent
} from "@features/surveys-management/containers/surveys-management-create-container/surveys-management-create-container.component";
import {
  SurveysManagementItemContainerComponent
} from "@features/surveys-management/containers/surveys-management-item-container/surveys-management-item-container.component";

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
        component: SurveysManagementContainerComponent,
        data: {
          title: 'TITLE_SURVEYS_MANAGEMENT',
        },
      },
      {
        path: 'create',
        component: SurveysManagementCreateContainerComponent,
        data: {
          title: 'TITLE_SURVEYS_MANAGEMENT',
        },
      },
      {
        path: ':id',
        component: SurveysManagementItemContainerComponent,
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
export class SurveysManagementRoutingModule {}
