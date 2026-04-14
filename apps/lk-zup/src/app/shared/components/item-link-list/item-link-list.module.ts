import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ItemLinkListComponent } from './item-link-list/item-link-list.component';
import { LangModule } from '@shared/features/lang/lang.module';

@NgModule({
  declarations: [ItemLinkListComponent],
  imports: [CommonModule, LangModule],
  exports: [ItemLinkListComponent],
})
export class ItemLinkListModule {}
