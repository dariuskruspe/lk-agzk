import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { UserTextDialogComponent } from '@features/users/components/user-text-dialog/user-text-dialog.component';
import { AvatarComponent } from '@shared/components/avatar/avatar.component';
import { MessagesModule } from '@shared/components/form-messages/messages.module';
import { InfoDialogModule } from '@shared/components/info-dialog/info-dialog.module';
import { InfoComponent } from '@shared/components/info/info.component';
import { ItemListModule } from '@shared/components/item-list/item-list.module';
import { StepsComponent } from '@shared/components/steps/steps.component';
import { FpcModule } from '@shared/features/fpc/fpc.module';
import { LangModule } from '@shared/features/lang/lang.module';
import { SignatureCreationFormModule } from '@shared/features/signature-creation-form/signature-creation-form.module';
import { SuccessWindowModule } from '@shared/features/success-window/success-window.module';
import { TrustedHtmlModule } from '@shared/pipes/security/trusted-html.module';
import { QrCodeModule } from 'ng-qrcode';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PasswordModule } from 'primeng/password';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SplitterModule } from 'primeng/splitter';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { UserProfileDialogComponent } from './components/user-profile-dialog/user-profile-dialog.component';
import { UserProfileMagicLinkComponent } from './components/user-profile-magic-link/user-profile-magic-link.component';
import { UserProfileSignatureComponent } from './components/user-profile-signature/user-profile-signature.component';
import { UsersProfileAppSettingsComponent } from './components/users-profile-app-settings/users-profile-app-settings.component';
import { UsersProfileContactsComponent } from './components/users-profile-contacts/users-profile-contacts.component';
import { UsersProfileOrganizationComponent } from './components/users-profile-organization/users-profile-organization.component';
import { UsersProfilePasswordComponent } from './components/users-profile-password/users-profile-password.component';
import { UsersProfilePersonalDataComponent } from './components/users-profile-personal-data/users-profile-personal-data.component';
import { UserProfileAppSettingsContainerComponent } from './containers/user-profile-app-settings-container/user-profile-app-settings-container.component';
import { UserProfileInfoContainerComponent } from './containers/user-profile-info-container/user-profile-info-container.component';
import { UserProfileIssuesDialogContainerComponent } from './containers/user-profile-issues-dialog-container/user-profile-issues-dialog-container.component';
import { UserProfileMagicLinkContainerComponent } from './containers/user-profile-magic-link-container/user-profile-magic-link-container.component';
import { UserProfilePasswordContainerComponent } from './containers/user-profile-password-container/user-profile-password-container.component';
import { UserProfileSignatureContainerComponent } from './containers/user-profile-signature-container/user-profile-signature-container.component';
import { UsersProfileContainerComponent } from './containers/users-profile-container/users-profile-container.component';
import { UsersRoutingModule } from './users-routing.module';

@NgModule({
  declarations: [
    UsersProfileOrganizationComponent,
    UsersProfilePersonalDataComponent,
    UsersProfilePasswordComponent,
    UsersProfileContactsComponent,
    UsersProfileContainerComponent,
    UserProfileIssuesDialogContainerComponent,
    UserProfileDialogComponent,
    UserProfileSignatureComponent,
    UserProfileMagicLinkComponent,
    UserProfileInfoContainerComponent,
    UserProfilePasswordContainerComponent,
    UserProfileSignatureContainerComponent,
    UserProfileMagicLinkContainerComponent,
    UserProfileAppSettingsContainerComponent,
    UsersProfileAppSettingsComponent,
    UserTextDialogComponent,
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    ReactiveFormsModule,
    FpcModule,
    SuccessWindowModule,
    LangModule,
    QrCodeModule,
    ItemListModule,
    CardModule,
    ToolbarModule,
    ButtonModule,
    DragDropModule,
    InfoDialogModule,
    SignatureCreationFormModule,
    PasswordModule,
    MessagesModule,
    SplitterModule,
    InputSwitchModule,
    FormsModule,
    TooltipModule,
    TrustedHtmlModule,
    ProgressSpinnerModule,
    AvatarComponent,
    MatDialogModule,
    StepsComponent,
    AccordionModule,
    InputTextareaModule,
    InfoComponent,
  ],
  providers: [DatePipe],
})
export class UsersModule {}
