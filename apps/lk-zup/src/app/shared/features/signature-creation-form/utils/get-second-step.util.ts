import { Type } from '@angular/core';
import { SignatureResponseInterface } from '../../../models/signature-response.interface';
import { SignatureProviderInterface } from '../../signature-validation-form/models/providers.interface';
import { ProvidersAlias } from '../../signature-validation-form/models/signature-validation-type.interface';
import { AbstractCreationComponent } from '../components/abstract-creation/abstract-creation.component';
import { LinkCreationComponent } from '../components/link-creation/link-creation.component';
import { SmsCreationContainerComponent } from '../containers/sms-creation-container/sms-creation-container.component';

export function getSecondStepComponent(
  provider: SignatureProviderInterface,
  data?: SignatureResponseInterface
): Type<AbstractCreationComponent> | null {
  if (
    data?.requestID &&
    provider.metadata.confirmMethod === ProvidersAlias.sms
  ) {
    // return SmsCreationContainerComponent;
    return null; // HRM-39487 (см. коммент https://jr.9958258.ru/browse/HRM-39487?focusedId=1413591&page=com.atlassian.jira.plugin.system.issuetabpanels%3Acomment-tabpanel#comment-1413591)
  }
  if (data?.message || data?.link) {
    return LinkCreationComponent;
  }
  return null;
}
