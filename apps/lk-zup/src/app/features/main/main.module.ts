import { CommonModule } from '@angular/common';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AsideMenuModule } from '@shared/components/aside-menu/aside-menu.module';
import { AvatarComponent } from '@shared/components/avatar/avatar.component';
import { DocSingArchDownloadModule } from '@shared/components/doc-sing-arch-download/doc-sing-arch-download.module';
import { NotificationItemComponent } from '@shared/components/notification-item/notification-item.component';
import { AppSkeletonModule } from '@shared/directives/app-skeleton.module';
import { AttentionModule } from '@shared/directives/attention.module';
import { ScrollableModule } from '@shared/directives/scrollable.module';
import { LangModule } from '@shared/features/lang/lang.module';
import { PushesModule } from '@shared/features/pushes/pushes.module';
import { SignatureValidationFormModule } from '@shared/features/signature-validation-form/signature-validation-form.module';
import { UnfinishedActionsModule } from '@shared/features/unfinished-actions/unfinished-actions.module';
import { AppDateModule } from '@shared/pipes/app-date.module';
import { IconPackModule } from '@shared/pipes/icon-pack.module';
import { CustomDialogService } from '@shared/services/dialog.service';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ListboxModule } from 'primeng/listbox';
import { RippleModule } from 'primeng/ripple';
import { SkeletonModule } from 'primeng/skeleton';
import { ToastModule } from 'primeng/toast';
import { MobileFullDirective } from 'shared/directives/mobile-full.directive';
import { BreadcrumbModule, BreadcrumbService } from 'xng-breadcrumb';
import { EmptyReloadingPageComponent } from './components/empty-reloading-page/empty-reloading-page.component';
import { MainAgreementsDialogComponent } from './components/main-agreements-dialog/main-agreements-dialog.component';
import { MainBreadcrumbsComponent } from './components/main-breadcrumbs/main-breadcrumbs.component';
import { MainCompanyComponent } from './components/main-company/main-company.component';
import { MainHeaderUserMenuComponent } from './components/main-header-user-menu/main-header-user-menu.component';
import { MainHeaderComponent } from './components/main-header/main-header.component';
import { DefaultDialogComponent } from './components/main-menu/default-dialog/default-dialog.component';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { MainWelcomeComponent } from './components/main-welcome/main-welcome.component';
import { NotificationsWindowComponent } from './components/notifications-window/notifications-window.component';
import { MainTemplateContainerComponent } from './containers/main-template-container/main-template-container.component';
import { MainSidebarComponent } from './components/main-sidebar/sidebar.component';
import { LogoComponent } from '@app/shared/components/logo/logo.component';
import { LucideAngularModule } from 'lucide-angular';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { LiquidContainerComponent } from '@app/shared/features/liquid/liquid-container.component';
import { MainNotificationsOverlayComponent } from '@app/features/main/components/main-notifications-overlay/main-notifications-overlay.component';
import { MainUserMenuOverlayComponent } from '@app/features/main/components/main-user-menu-overlay/main-user-menu-overlay.component';
import { MainSidebarHeaderComponent } from './components/main-sidebar-header/main-sidebar-header.component';
import { MainBottomNavComponent } from './components/main-bottom-nav/main-bottom-nav.component';
import { Docky } from "@app/shared/features/docky-v2/docky/docky";
@NgModule({
  declarations: [
    MainHeaderComponent,
    MainTemplateContainerComponent,
    MainWelcomeComponent,
    MainMenuComponent,
    MainBreadcrumbsComponent,
    MainHeaderUserMenuComponent,
    MainAgreementsDialogComponent,
    MainCompanyComponent,
    MainSidebarComponent,
    MainSidebarHeaderComponent,
    DefaultDialogComponent,
    NotificationsWindowComponent,
    MainNotificationsOverlayComponent,
    MainUserMenuOverlayComponent,
  ],
  imports: [
    RouterModule,
    CommonModule,
    MatIconModule,
    DocSingArchDownloadModule,
    LangModule,
    BreadcrumbModule,
    SignatureValidationFormModule,
    DynamicDialogModule,
    BadgeModule,
    ButtonModule,
    SkeletonModule,
    AsideMenuModule,
    ListboxModule,
    IconPackModule,
    ToastModule,
    DropdownModule,
    FormsModule,
    PushesModule,
    RippleModule,
    InputSwitchModule,
    AppDateModule,
    AppSkeletonModule,
    ScrollableModule,
    DialogModule,
    UnfinishedActionsModule,
    NotificationItemComponent,
    AttentionModule,
    MobileFullDirective,
    AvatarComponent,
    ConfirmPopupModule,
    LogoComponent,
    LucideAngularModule,
    RouterOutlet,
    LiquidContainerComponent,
    MainBottomNavComponent,
    Docky
],
  exports: [MainTemplateContainerComponent],
  providers: [
    BreadcrumbService,
    {
      provide: DialogService,
      useClass: CustomDialogService,
    },
    provideHttpClient(withInterceptorsFromDi()),
  ],
})
export class MainModule {}
