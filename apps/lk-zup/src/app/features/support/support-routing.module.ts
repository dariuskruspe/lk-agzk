import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../shared/guards/auth.guard';
import { SupportConfluenceContainerComponent } from './containers/support-confluence-container/support-confluence-container.component';
import { SupportEmptyPageContainerComponent } from './containers/support-empty-page-container/support-empty-page-container.component';
import { SupportInformationContainerComponent } from './containers/support-information-container/support-information-container.component';
import { SupportInformationPageContainerComponent } from './containers/support-information-page-container/support-information-page-container.component';
import { SupportMainContainerComponent } from './containers/support-main-container/support-main-container.component';
import { SupportOnboardingContainerComponent } from './containers/support-onboarding-container/support-onboarding-container.component';
import { SupportVersionInfoContainerComponent } from './containers/support-version-info-container/support-version-info-container.component';

const routes: Routes = [
  {
    path: '',
    component: SupportMainContainerComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'release',
    component: SupportVersionInfoContainerComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'onb',
    component: SupportOnboardingContainerComponent,
    canActivate: [AuthGuard],
  },
  {
    path: ':alias',
    component: SupportConfluenceContainerComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'info/:groupId',
    component: SupportInformationContainerComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'empty',
        component: SupportEmptyPageContainerComponent,
      },
      {
        path: ':pageId',
        component: SupportInformationPageContainerComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SupportRoutingModule {}
