import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from '@features/auth/components/auth/auth.component';
import { AuthFactor2CodeContainerComponent } from './containers/auth-factor2-code-container/auth-factor2-code-container.component';
import { AuthMagicLinkContainerComponent } from './containers/auth-magic-link-container/auth-magic-link-container.component';
import { AuthRestorePasswordContainerComponent } from './containers/auth-restore-password-container/auth-restore-password-container.component';
import { AuthRestorePasswordNewContainerComponent } from './containers/auth-restore-password-new-container/auth-restore-password-new-container.component';
import { AuthSmsContainerComponent } from './containers/auth-sms-container/auth-sms-container.component';
import { AuthSsoSaml2ResContainerComponent } from './containers/auth-sso-saml2-res-container/auth-sso-saml2-res-container.component';
import { AuthLoginGuard } from './guards/auth-login.guard';

const routes: Routes = [
  {
    path: '',
    // component: AuthTypeResolverComponent,
    component: AuthComponent,
    canActivate: [AuthLoginGuard],
  },
  {
    path: 'restorePass',
    component: AuthRestorePasswordContainerComponent,
    data: { title: 'TITLE_RECOVERY' },
  },
  {
    path: 'restorePass/newPass',
    component: AuthRestorePasswordNewContainerComponent,
  },
  {
    path: 'ml',
    component: AuthMagicLinkContainerComponent,
  },
  {
    path: 'f2',
    component: AuthFactor2CodeContainerComponent,
  },
  {
    path: 'sms',
    component: AuthSmsContainerComponent,
  },
  {
    path: 'saml2-redirect',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    component: AuthSsoSaml2ResContainerComponent,
    canActivate: [AuthLoginGuard],
  },
];

// временно добавили в основные маршруты, нужно переделать с учетом новой авторизации
// if (Environment.inv().authType === 'sso' || isDev()) {
//   routes.push({
//     path: 'saml2-redirect',
//     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//     // @ts-ignore
//     component: AuthSsoSaml2ResContainerComponent,
//     canActivate: [AuthLoginGuard],
//   });
// }

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule { }
