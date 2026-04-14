import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LangModule } from '../../features/lang/lang.module';
import { TrustedHtmlModule } from '../../pipes/security/trusted-html.module';
import { ItemListComponent } from './item-list/item-list.component';

@NgModule({
  declarations: [ItemListComponent],
  imports: [CommonModule, LangModule, TrustedHtmlModule],
  exports: [ItemListComponent],
})
export class ItemListModule {}
