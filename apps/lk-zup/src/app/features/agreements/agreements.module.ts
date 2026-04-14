import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AgreementsFilterComponent } from '@features/agreements/components/agreements-filters/agreements-filter.component';
import { DocSingArchDownloadModule } from '@shared/components/doc-sing-arch-download/doc-sing-arch-download.module';
import { PdfViewerModule } from '@shared/components/pdf-viewer/pdf-viewer.module';
import { CryptoProCertSelectComponent } from '@shared/features/crypto-pro/crypto-pro-cert-select/crypto-pro-cert-select.component';
import { FilterModule } from '@shared/features/fpc-filter/filter.module';
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
import { AgreementsRoutingModule } from './agreements-routing.module';
import { AgreementTypeResolverComponent } from './components/agreement-type-resolver/agreement-type-resolver.component';
import { AgreementViewComponent } from './components/agreement-view/agreement-view.component';
import { DocumentComponent } from './components/agreements-document-page/document.component';
import { AgreementsListSigningDialogComponent } from './components/agreements-list-signing-dialog/agreements-list-signing-dialog.component';
import { AgreementsListComponent } from './components/agreements-list/agreements-list.component';
import { AgreementsPreviewFileDialogComponent } from './components/agreements-preview-file-dialog/agreements-preview-file-dialog.component';
import { AgreementsResultDialogComponent } from './components/agreements-result-dialog/agreements-result-dialog.component';
import { AbstractDocumentListContainerComponent } from '@features/agreements/containers/abstract-document-list-container/abstract-document-list-container.component';
import { DocumentContainerComponent } from '@features/agreements/containers/document-container/document-container.component';
import { DocumentDialogContainerComponent } from './containers/agreements-document-dialog-container/document-dialog-container.component';
import { AgreementsListContainerComponent } from './containers/agreements-list-container/agreements-list-container.component';
import { MyDocumentsListContainerComponent } from './containers/my-documents-list-container/my-documents-list-container';

@NgModule({
  imports: [
    CommonModule,
    AgreementsRoutingModule,
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
    CryptoProCertSelectComponent,
    FilterModule,
  ],
  declarations: [
    AgreementsListComponent,
    AgreementViewComponent,
    AgreementsListContainerComponent,
    DocumentDialogContainerComponent,
    DocumentContainerComponent,
    DocumentComponent,
    AbstractDocumentListContainerComponent,
    MyDocumentsListContainerComponent,
    AgreementTypeResolverComponent,
    AgreementsListSigningDialogComponent,
    AgreementsPreviewFileDialogComponent,
    AgreementsResultDialogComponent,
    AgreementsFilterComponent,
  ],
})
export class AgreementsModule {}
