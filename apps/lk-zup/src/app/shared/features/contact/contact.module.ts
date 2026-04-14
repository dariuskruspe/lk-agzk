import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { LangModule } from '../lang/lang.module';
import { ContactComponent } from './components/contact/contact.component';
import { ContactContainerComponent } from './containers/contact-container/contact-container.component';

@NgModule({
  declarations: [ContactComponent, ContactContainerComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputMaskModule,
    ButtonModule,
    InputTextModule,
    LangModule,
  ],
  exports: [ContactContainerComponent],
})
export class ContactModule {}
