import { AppValidationComponent } from '../components/app-validation/app-validation.component';
import { ConfirmValidationComponent } from '../components/confirm-validation/confirm-validation.component';
import { CreationSignatureComponent } from '../components/creation-signature/creation-signature.component';
import { LinkValidationComponent } from '../components/link-validation/link-validation.component';
import { LocalValidationComponent } from '../components/local-validation/local-validation.component';
import { PasswordValidationComponent } from '../components/password-validation/password-validation.component';
import { SmsValidationContainerComponent } from '../containers/sms-validation-container/sms-validation-container.component';
import { Order } from '../models/signature-validation-order.interface';
import { ProvidersAlias } from '../models/signature-validation-type.interface';
import { SignatureValidationInterface } from '../models/signature-validation.interface';

export const SignatureValidation: SignatureValidationInterface = {
  [ProvidersAlias.confirm]: {
    type: ConfirmValidationComponent,
    order: Order.before,
  },
  [ProvidersAlias.link]: {
    type: LinkValidationComponent,
    order: Order.after,
  },
  [ProvidersAlias.inputPassword]: {
    type: PasswordValidationComponent,
    order: Order.before,
  },
  [ProvidersAlias.confirmByOtherApp]: {
    type: AppValidationComponent,
    order: Order.after,
  },
  [ProvidersAlias.local]: {
    type: LocalValidationComponent,
    order: Order.before,
  },
  [ProvidersAlias.createNew]: {
    type: CreationSignatureComponent,
    order: Order.none,
  },
  [ProvidersAlias.sms]: {
    type: SmsValidationContainerComponent,
    order: Order.after,
  },
  [ProvidersAlias.smsSigningOnly]: {
    type: SmsValidationContainerComponent,
    order: Order.after,
  },
  [ProvidersAlias.smsSigningIssueRelease]: {
    type: SmsValidationContainerComponent,
    order: Order.after,
  },
  [ProvidersAlias.emailSigningIssueRelease]: {
    type: SmsValidationContainerComponent,
    order: Order.after,
  },
};
