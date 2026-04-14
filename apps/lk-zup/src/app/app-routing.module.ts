import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmptyComponent } from '@shared/components/empty/empty.component';
import { DatabaseUpdateComponent } from '@shared/features/special-pages/database-update/components/database-update/database-update.component';
import { NotFoundComponent } from '@shared/features/special-pages/not-found/components/not-found-component/not-found.component';
import { SomethingWentWrongComponent } from '@shared/features/special-pages/something-went-wrong/components/something-went-wrong/something-went-wrong.component';
import { TemporarilyUnavailableComponent } from '@shared/features/special-pages/temporarily-unavailable/components/temporarily-unavailable/temporarily-unavailable.component';
import { LayoutRootComponent } from './layout/layout-root/layout-root.component';
import { PlatformModuleResolver } from './shared/features/platform-dependent/platform-module-resolver.service';
import { EnabledGuard } from './shared/guards/enabled.guard';
import { NewsletterConfirmationContainerComponent } from './features/newsletter-management/containers/newsletter-confirmation-container/newsletter-confirmation-container.component';

import featuresRoutes from './features/features.routes';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/main-auth/main-auth.module').then(
        (m) => m.MainAuthModule,
      ),
    data: { title: 'TITLE_AUTH' },
  },

  {
    path: 'approve',
    loadChildren: () =>
      import('./features/issues-approval/issues-approval.module').then(
        (m) => m.IssuesApprovalModule,
      ),
    data: { title: '' },
  },
  {
    path: 'issueEmailApprove',
    loadChildren: () =>
      import('./features/issues-approval/issues-approval.module').then(
        (m) => m.IssuesApprovalModule,
      ),
    data: { title: '' },
  },
  {
    path: 'manageNewsletter/newsletterConfirmation',
    component: NewsletterConfirmationContainerComponent,
  },
  {
    path: 'null',
    component: EmptyComponent,
  },
  {
    path: 'db-update',
    component: DatabaseUpdateComponent,
  },
  {
    path: 'database-update',
    component: DatabaseUpdateComponent,
  },
  {
    path: 'something-went-wrong',
    component: SomethingWentWrongComponent,
  },
  {
    path: 'temporarily-unavailable',
    component: TemporarilyUnavailableComponent,
  },

  {
    path: '',
    component: LayoutRootComponent,
    // todo: вернуть онбординг
    // resolve: {
    //   platform: PlatformModuleResolver,
    // },
    canActivate: [EnabledGuard],
    loadChildren: () => import('./features/features.routes'),
  },
  {
    path: '**',
    component: NotFoundComponent,
    data: { title: 'PAGE_NOT_FOUND' },
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      bindToComponentInputs: true,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
