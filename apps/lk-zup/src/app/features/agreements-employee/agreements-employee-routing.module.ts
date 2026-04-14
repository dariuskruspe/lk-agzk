import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentContainerComponent } from '@features/agreements/containers/document-container/document-container.component';
import { AgreementEmployeeTypeResolverComponent } from './components/agreement-employee-type-resolver/agreement-type-resolver.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'SIGNED_DOCUMENTS',
    },
    children: [
      {
        path: '',
        component: AgreementEmployeeTypeResolverComponent,
      },
      {
        path: ':owner/:id',
        // component: AgreementsEmployeeDocumentContainerComponent,
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
export class AgreementsEmployeeRoutingModule {}
