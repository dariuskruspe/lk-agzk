import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormErrorComponent } from './components/form-error/form-error.component';
import { FormFieldComponent } from './components/form-field/form-field.component';
import { FormErrorsDirective } from './directives/form-errors.directive';
import { FormTitleComponent } from './components/form-title/form-title.component';

@NgModule({
  imports: [CommonModule],
  declarations: [
    FormFieldComponent,
    FormErrorComponent,
    FormErrorsDirective,
    FormTitleComponent,
  ],
  exports: [
    FormFieldComponent,
    FormErrorComponent,
    FormErrorsDirective,
    FormTitleComponent,
  ],
})
export class PrimeFormUtilsModule {}
