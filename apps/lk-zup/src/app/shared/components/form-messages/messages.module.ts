import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormFieldDirective } from '../../directives/form-field.directive';
import { MapDirective } from '../../directives/map.directive';
import { LangModule } from '../../features/lang/lang.module';
import { MessagesComponent } from './messages.component';

@NgModule({
  imports: [CommonModule, LangModule],
  declarations: [MessagesComponent, FormFieldDirective, MapDirective],
  exports: [MessagesComponent, FormFieldDirective, MapDirective],
})
export class MessagesModule {}
