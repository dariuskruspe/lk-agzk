import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgreementTypeResolverComponent } from './components/agreement-type-resolver/agreement-type-resolver.component';
import { DocumentContainerComponent } from '@features/agreements/containers/document-container/document-container.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'SIGNED_DOCUMENTS',
    },
    children: [
      {
        path: '',
        component: AgreementTypeResolverComponent,
      },
      {
        path: ':owner/:id',
        component: DocumentContainerComponent,
        data: {
          title: 'SHOW_DOCUMENT_PAGE',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgreementsRoutingModule {}
