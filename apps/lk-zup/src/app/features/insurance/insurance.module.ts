import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InsuranceCalculatorComponent } from '@features/insurance/components/insurance-calculator/insurance-calculator.component';
import { InsuranceCustomAccordionComponent } from '@features/insurance/components/insurance-custom-accordion/insurance-custom-accordion.component';
import { DocSingArchDownloadModule } from '@shared/components/doc-sing-arch-download/doc-sing-arch-download.module';
import { ItemListBuilderModule } from '@shared/components/item-list-builder/item-list-builder.module';
import { LangModule } from '@shared/features/lang/lang.module';
import { LoadableListModule } from '@shared/features/loadable-list/loadable-list.module';
import { TrustedHtmlModule } from '@shared/pipes/security/trusted-html.module';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { IssuesModule } from '../issues/issues.module';
import { InsuranceCardComponent } from './components/insurance-card/insurance-card.component';
import { InsuranceIssuesComponent } from './components/insurance-issues/insurance-issues.component';
import { InsuranceContainerComponent } from './containers/insurance-container/insurance-container.component';
import { InsuranceIssuesContainerComponent } from './containers/insurance-issues-container/insurance-issues-container.component';
import { InsuranceRoutingModule } from './insurance-routing.module';

@NgModule({
  declarations: [
    InsuranceContainerComponent,
    InsuranceCardComponent,
    InsuranceIssuesComponent,
    InsuranceIssuesContainerComponent,
    InsuranceCalculatorComponent,
    InsuranceCustomAccordionComponent,
  ],
  imports: [
    CommonModule,
    InsuranceRoutingModule,
    DropdownModule,
    FormsModule,
    LangModule,
    CardModule,
    ButtonModule,
    ToolbarModule,
    ItemListBuilderModule,
    LoadableListModule,
    IssuesModule,
    DocSingArchDownloadModule,
    ProgressSpinnerModule,
    AccordionModule,
    InputNumberModule,
    TrustedHtmlModule,
    TooltipModule,
  ],
})
export class InsuranceModule {}
