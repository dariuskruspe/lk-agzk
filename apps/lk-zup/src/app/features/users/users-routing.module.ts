import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../shared/guards/auth.guard';
import { UserProfileAppSettingsContainerComponent } from './containers/user-profile-app-settings-container/user-profile-app-settings-container.component';
import { UserProfileInfoContainerComponent } from './containers/user-profile-info-container/user-profile-info-container.component';
import { UserProfileMagicLinkContainerComponent } from './containers/user-profile-magic-link-container/user-profile-magic-link-container.component';
import { UserProfilePasswordContainerComponent } from './containers/user-profile-password-container/user-profile-password-container.component';
import { UserProfileSignatureContainerComponent } from './containers/user-profile-signature-container/user-profile-signature-container.component';
import { UsersProfileContainerComponent } from './containers/users-profile-container/users-profile-container.component';

const routes: Routes = [
  {
    path: 'profile',
    component: UsersProfileContainerComponent,
    children: [
      {
        path: '',
        redirectTo: 'info',
        pathMatch: 'full',
      },
      {
        path: 'info',
        component: UserProfileInfoContainerComponent,
        data: {
          title: 'TITLE_PROFILE',
        },
      },
      {
        path: 'password',
        component: UserProfilePasswordContainerComponent,
        data: {
          title: 'CHANGE_PASSWORD',
        },
      },
      {
        path: 'signature',
        component: UserProfileSignatureContainerComponent,
        data: {
          title: 'ELECTRONIC_SIGNATURE',
        },
      },
      {
        path: 'magic-link',
        component: UserProfileMagicLinkContainerComponent,
        data: {
          title: 'AUTH_WAYS',
        },
      },
      {
        path: 'settings',
        component: UserProfileAppSettingsContainerComponent,
        data: {
          title: 'APP_SETTINGS',
        },
      },
    ],
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
