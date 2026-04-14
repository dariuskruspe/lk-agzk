import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LangModule } from '@shared/features/lang/lang.module';
import { BaseFormModule } from '@wafpc/base/base-form.module';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { IconPackModule } from '../../pipes/icon-pack.module';
import { TrustedHtmlModule } from '../../pipes/security/trusted-html.module';
import { ItemListBuilderComponent } from './item-list-builder/item-list-builder.component';

@NgModule({
  declarations: [ItemListBuilderComponent],
  imports: [
    CommonModule,
    TrustedHtmlModule,
    TagModule,
    TooltipModule,
    ToolbarModule,
    IconPackModule,
    CheckboxModule,
    FormsModule,
    RouterLink,
    LangModule,
    ButtonModule,
    BaseFormModule,
  ],
  exports: [ItemListBuilderComponent],
})
export class ItemListBuilderModule {}
