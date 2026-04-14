import { CommonModule } from '@angular/common';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { KeyFilterModule } from 'primeng/keyfilter';
import { ListboxModule } from 'primeng/listbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { PasswordModule } from 'primeng/password';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RadioButtonModule } from 'primeng/radiobutton';
import { BaseFormModule } from '../base/base-form.module';
import { TranslatePipe } from '../base/pipes/lang.pipe';
import { ArrSmartShowModeComponent } from './components/arr-smart-show-mode/arr-smart-show-mode.component';
import { ArrSmartComponent } from './components/arr-smart/arr-smart.component';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { ComputedComponent } from './components/computed/computed.component';
import { DatepickerComponent } from './components/datepicker/datepicker.component';
import { FileUploaderComponent } from './components/file-uploader/file-uploader.component';
import { FpcFilesComponent } from './components/fpc-files/fpc-files.component';
import { FpcPrimeComponent } from './components/fpc-main/fpc-main.component';
import { FpcShowFileDialogComponent } from './components/fpc-show-file-dialog/fpc-show-file-dialog.component';
import { MessagesComponent } from './components/messages/messages.component';
import { MultiSelectComponent } from './components/multi-select/multi-select.component';
import { NumberInputComponent } from './components/number-input/number-input.component';
import { PasswordInputComponent } from './components/password-input/password-input.component';
import { RadioGroupComponent } from './components/radio-group/radio-group.component';
import { SelectShowModeComponent } from './components/select-show-mode/select-show-mode.component';
import { SelectComponent } from './components/select/select.component';
import { TextInputComponent } from './components/text-input/text-input.component';
import { TextareaComponent } from './components/textarea/textarea.component';
import { TimepickerComponent } from './components/timepicker/timepicker.component';
import { FormFieldDirective } from './directives/form-field.directive';

@NgModule({
  declarations: [
    FpcPrimeComponent,
    ArrSmartComponent,
    ArrSmartShowModeComponent,
    SelectShowModeComponent,
    MultiSelectComponent,
    SelectComponent,
    RadioGroupComponent,
    TextareaComponent,
    FileUploaderComponent,
    TextInputComponent,
    PasswordInputComponent,
    NumberInputComponent,
    DatepickerComponent,
    FpcFilesComponent,
    FpcShowFileDialogComponent,
    MessagesComponent,
    FormFieldDirective,
    CheckboxComponent,
    ComputedComponent,
    TimepickerComponent,
  ],
  exports: [
    FpcPrimeComponent,
    FpcShowFileDialogComponent,
    FpcFilesComponent,
    FileUploaderComponent,
    FormFieldDirective,
  ],
  imports: [
    CommonModule,
    BaseFormModule,
    ButtonModule,
    ReactiveFormsModule,
    FormsModule,
    MultiSelectModule,
    DropdownModule,
    RadioButtonModule,
    CheckboxModule,
    InputTextareaModule,
    FileUploadModule,
    InputNumberModule,
    InputTextModule,
    PasswordModule,
    CalendarModule,
    KeyFilterModule,
    ListboxModule,
    ProgressSpinnerModule,
  ],
  providers: [TranslatePipe, provideHttpClient(withInterceptorsFromDi())],
})
export class PrimeFpcModule {
  static forRoot(
    providers: Provider[] = []
  ): ModuleWithProviders<PrimeFpcModule> {
    return {
      ngModule: PrimeFpcModule,
      providers,
    };
  }
}
