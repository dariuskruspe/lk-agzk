import { Type } from '@angular/core';
import { PasswordCreationComponent } from '@shared/features/signature-creation-form/components/password-creation/password-creation.component';
import { SignatureProviderInterface } from '../../signature-validation-form/models/providers.interface';
import { ProvidersAlias } from '../../signature-validation-form/models/signature-validation-type.interface';
import { AbstractCreationComponent } from '../components/abstract-creation/abstract-creation.component';
import { ConfirmCreationComponent } from '../components/confirm-creation/confirm-creation.component';
import { ExternalCreationComponent } from '../components/external-creation/external-creation.component';
import { IssueCreationComponent } from '../components/issue-creation/issue-creation.component';

export function getSignatureCreationType(
  provider: SignatureProviderInterface
): Type<AbstractCreationComponent> {
  switch (provider.metadata.confirmMethod) {
    case ProvidersAlias.inputPassword:
      return provider?.ui?.requirePasswordSetup
        ? PasswordCreationComponent
        : ExternalCreationComponent;
    case ProvidersAlias.sms:
    case ProvidersAlias.smsSigningOnly:
    case ProvidersAlias.confirmByOtherApp:
      if (Object.keys(provider.ui.userData || {}).length) {
        return ExternalCreationComponent;
      }
      return ConfirmCreationComponent;
    case ProvidersAlias.smsSigningIssueRelease:
    case ProvidersAlias.emailSigningIssueRelease:
      return IssueCreationComponent;
    case ProvidersAlias.confirm:
    case ProvidersAlias.link:
    default:
      return ConfirmCreationComponent;
  }
}
