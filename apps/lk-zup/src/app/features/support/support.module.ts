import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { TrustedHtmlModule } from '@shared/pipes/security/trusted-html.module';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ToolbarModule } from 'primeng/toolbar';
import { ItemListModule } from '../../shared/components/item-list/item-list.module';
import { LangModule } from '../../shared/features/lang/lang.module';
import { SupportConfluenceBodyComponent } from './components/support-confluence-body/support-confluence-body.component';
import { SupportConfluenceMenuComponent } from './components/support-confluence-menu/support-confluence-menu.component';
import { SupportContactsComponent } from './components/support-contacts/support-contacts.component';
import { SupportHelpComponent } from './components/support-help/support-help.component';
import { SupportInformationMenuComponent } from './components/support-information-menu/support-information-menu.component';
import { SupportInformationPageComponent } from './components/support-information-page/support-information-page.component';
import { SupportOnboardingComponent } from './components/support-onboarding/support-onboarding.component';
import { SupportVersionInfoMenuComponent } from './components/support-version-info-menu/support-version-info-menu.component';
import { SupportVersionInfoComponent } from './components/support-version-info/support-version-info.component';
import { SupportConfluenceContainerComponent } from './containers/support-confluence-container/support-confluence-container.component';
import { SupportEmptyPageContainerComponent } from './containers/support-empty-page-container/support-empty-page-container.component';
import { SupportInformationContainerComponent } from './containers/support-information-container/support-information-container.component';
import { SupportInformationPageContainerComponent } from './containers/support-information-page-container/support-information-page-container.component';
import { SupportMainContainerComponent } from './containers/support-main-container/support-main-container.component';
import { SupportOnboardingContainerComponent } from './containers/support-onboarding-container/support-onboarding-container.component';
import { SupportVersionInfoContainerComponent } from './containers/support-version-info-container/support-version-info-container.component';
import { TrustedUrlPipe } from './pipes/trusted-url.pipe';
import { SupportRoutingModule } from './support-routing.module';

@NgModule({
  declarations: [
    SupportHelpComponent,
    SupportMainContainerComponent,
    SupportContactsComponent,
    SupportConfluenceBodyComponent,
    SupportConfluenceMenuComponent,
    SupportConfluenceContainerComponent,
    SupportInformationPageComponent,
    SupportInformationMenuComponent,
    SupportInformationPageContainerComponent,
    SupportInformationContainerComponent,
    TrustedUrlPipe,
    SupportVersionInfoContainerComponent,
    SupportVersionInfoComponent,
    SupportVersionInfoMenuComponent,
    SupportEmptyPageContainerComponent,
    SupportOnboardingContainerComponent,
    SupportOnboardingComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    SupportRoutingModule,
    LangModule,
    TrustedHtmlModule,
    CardModule,
    ToolbarModule,
    PanelMenuModule,
    ItemListModule,
    ButtonModule,
  ],
  exports: [SupportInformationPageComponent],
})
export class SupportModule {}
