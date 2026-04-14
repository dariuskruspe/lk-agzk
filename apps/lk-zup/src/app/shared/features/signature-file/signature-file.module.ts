import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ListboxModule } from 'primeng/listbox';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToolbarModule } from 'primeng/toolbar';
import { MessagesModule } from '../../components/form-messages/messages.module';
import { PdfViewerModule } from '../../components/pdf-viewer/pdf-viewer.module';
import { LangModule } from '../lang/lang.module';
import { SignatureValidationFormModule } from '../signature-validation-form/signature-validation-form.module';
import { RefuseDialogComponent } from './components/refuse-dialog/refuse-dialog.component';
import { SignatureFileComponent } from './components/signature-file/signature-file.component';
import { SignatureFileContainerComponent } from './containers/signature-file-container/signature-file-container.component';
import { SignatureFileService } from './services/signature-file.service';
import { RecreateViewDirective } from '@shared/directives/recreate-view-key.directive';
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
  imports: [
    RecreateViewDirective,
    CommonModule,
    FormsModule,
    SignatureValidationFormModule,
    LangModule,
    PdfViewerModule,
    ProgressSpinnerModule,
    ButtonModule,
    ToolbarModule,
    CheckboxModule,
    ListboxModule,
    InputTextareaModule,
    ReactiveFormsModule,
    MessagesModule,
    ConfirmDialogModule,
    DropdownModule,
  ],
  declarations: [
    SignatureFileContainerComponent,
    SignatureFileComponent,
    RefuseDialogComponent,
  ],
  providers: [SignatureFileService],
  exports: [SignatureFileContainerComponent, SignatureValidationFormModule],
})
export class SignatureFileModule {}
