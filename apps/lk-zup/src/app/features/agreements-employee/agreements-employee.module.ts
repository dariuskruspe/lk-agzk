import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AgreementsEmployeeListItemComponent } from '@features/agreements-employee/components/agreements-employee-list-item/agreements-employee-list-item.component';
import { DocSingArchDownloadModule } from '@shared/components/doc-sing-arch-download/doc-sing-arch-download.module';
import { PdfViewerModule } from '@shared/components/pdf-viewer/pdf-viewer.module';
import { LangModule } from '@shared/features/lang/lang.module';
import { LoadableListModule } from '@shared/features/loadable-list/loadable-list.module';
import { SignatureFileModule } from '@shared/features/signature-file/signature-file.module';
import { SignatureValidationFormModule } from '@shared/features/signature-validation-form/signature-validation-form.module';
import { IconPackModule } from '@shared/pipes/icon-pack.module';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { AgreementsEmployeeRoutingModule } from './agreements-employee-routing.module';
import { AgreementEmployeeTypeResolverComponent } from './components/agreement-employee-type-resolver/agreement-type-resolver.component';
import { AgreementEmployeeViewComponent } from './components/agreement-employee-view/agreement-employee-view.component';
import { AgreementsEmployeeDocumentPageComponent } from './components/agreements-employee-document-page/agreements-employee-document-page.component';
import { AgreementsEmployeeListSigningDialogComponent } from './components/agreements-employee-list-signing-dialog/agreements-employee-list-signing-dialog.component';
import { AgreementsEmployeeListComponent } from './components/agreements-employee-list/agreements-employee-list.component';
import { AgreementsEmployeePreviewFileDialogComponent } from './components/agreements-employee-preview-file-dialog/agreements-employee-preview-file-dialog.component';
import { AgreementsEmployeeResultDialogComponent } from './components/agreements-employee-result-dialog/agreements-employee-result-dialog.component';
import { AbstractAgreementsEmployeeListContainerComponent } from './containers/abstract-agreements-employee-list-container/abstract-agreements-list-container.component';
import { AgreementsEmployeeDocumentContainerComponent } from './containers/agreements-employee-document-container/agreements-employee-document-container.component';
// eslint-disable-next-line max-len
import { AgreementsEmployeeDocumentDialogContainerComponent } from './containers/agreements-employee-document-dialog-container/agreements-employee-document-dialog-container.component';
import { AgreementsEmployeeListContainerComponent } from './containers/agreements-employee-list-container/agreements-employee-list-container.component';
import { MyDocumentsListContainerComponent } from './containers/my-documents-list-container/my-documents-list-container';

@NgModule({
  imports: [
    CommonModule,
    AgreementsEmployeeRoutingModule,
    LangModule,
    ReactiveFormsModule,
    FormsModule,
    LoadableListModule,
    SignatureValidationFormModule,
    DocSingArchDownloadModule,
    ButtonModule,
    PdfViewerModule,
    ToolbarModule,
    CheckboxModule,
    ProgressSpinnerModule,
    ProgressBarModule,
    SignatureFileModule,
    MatIconModule,
    DropdownModule,
    IconPackModule,
    InputTextModule,
    TooltipModule,
  ],
  declarations: [
    AgreementsEmployeeListComponent,
    AgreementEmployeeViewComponent,
    AgreementsEmployeeListContainerComponent,
    AgreementsEmployeeDocumentContainerComponent,
    AgreementsEmployeeDocumentPageComponent,
    AbstractAgreementsEmployeeListContainerComponent,
    MyDocumentsListContainerComponent,
    AgreementEmployeeTypeResolverComponent,
    AgreementsEmployeeListSigningDialogComponent,
    AgreementsEmployeePreviewFileDialogComponent,
    AgreementsEmployeeResultDialogComponent,
    AgreementsEmployeeDocumentDialogContainerComponent,
    AgreementsEmployeeListItemComponent,
  ],
})
export class AgreementsEmployeeModule {}
