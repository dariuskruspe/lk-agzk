import { Type } from '@angular/core';
import { ProvidersAlias } from '../../signature-validation-form/models/signature-validation-type.interface';
import { AbstractCreationComponent } from '../components/abstract-creation/abstract-creation.component';

export type CreationTypesInterface = {
  [type in Partial<ProvidersAlias>]?: Type<AbstractCreationComponent>;
};
