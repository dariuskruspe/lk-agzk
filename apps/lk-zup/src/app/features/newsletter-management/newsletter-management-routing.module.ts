import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../shared/guards/auth.guard';
import { NewsletterManagementContainerComponent } from './containers/newsletter-management-container/newsletter-management-container.component';
import { NewsletterListContainerComponent } from './containers/newsletter-list-container/newsletter-list-container.component';
import { NewsletterCreateContainerComponent } from './containers/newsletter-create-container/newsletter-create-container.component';
import { NewsletterViewContainerComponent } from './containers/newsletter-view-container/newsletter-view-container.component';
import { MessageTemplatesContainerComponent } from './containers/message-templates-container/message-templates-container.component';
import { MessageTemplateCreateContainerComponent } from './containers/message-template-create-container/message-template-create-container.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: NewsletterManagementContainerComponent,
    data: {
      title: 'NEWSLETTER_MANAGEMENT',
    },
    children: [
      {
        path: '',
        component: NewsletterListContainerComponent,
        data: {
          title: 'NEWSLETTER_MANAGEMENT',
        },
      },
      {
        path: 'templates',
        component: MessageTemplatesContainerComponent,
        data: {
          title: 'NEWSLETTER_MANAGEMENT',
        },
      },
    ],
  },
  {
    path: 'create',
    component: NewsletterCreateContainerComponent,
    data: {
      title: 'NEWSLETTER_MANAGEMENT',
    },
  },
  {
    path: 'edit/:id',
    component: NewsletterCreateContainerComponent,
    data: {
      title: 'NEWSLETTER_MANAGEMENT',
    },
  },
  {
    path: 'view/:id',
    component: NewsletterViewContainerComponent,
    data: {
      title: 'NEWSLETTER_MANAGEMENT',
    },
  },
  {
    path: 'templates/create',
    component: MessageTemplateCreateContainerComponent,
    data: {
      title: 'NEWSLETTER_MANAGEMENT',
    },
  },
  {
    path: 'templates/edit/:id',
    component: MessageTemplateCreateContainerComponent,
    data: {
      title: 'NEWSLETTER_MANAGEMENT',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewsletterManagementRoutingModule {}
