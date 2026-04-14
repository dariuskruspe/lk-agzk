import { Type } from '@angular/core';
import { AbstractValidationComponent } from '../components/abstract-validation/abstract-validation.component';
import { OrderType } from './signature-validation-order.interface';
import { ProvidersAlias } from './signature-validation-type.interface';

export type SignatureValidationInterface = {
  [type in ProvidersAlias]: {
    type: Type<AbstractValidationComponent>;
    order: OrderType;
  };
};
