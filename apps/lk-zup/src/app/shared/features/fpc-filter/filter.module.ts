import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { RippleModule } from 'primeng/ripple';
import { SidebarModule } from 'primeng/sidebar';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { PluralizeModule } from '../../directives/pluralize.module';
import { FpcModule } from '../fpc/fpc.module';
import { LangModule } from '../lang/lang.module';
import { FilterComponent } from '@shared/features/fpc-filter/components/fpc-filter/filter.component';

@NgModule({
  declarations: [FilterComponent],
  exports: [FilterComponent],
  imports: [
    FpcModule,
    CommonModule,
    CheckboxModule,
    ButtonModule,
    SidebarModule,
    LangModule,
    PluralizeModule,
    SharedModule,
    ToolbarModule,
    RippleModule,
    TooltipModule,
  ],
})
export class FilterModule {}
