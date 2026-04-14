import { GeRx } from 'gerx';
import { Observable } from 'rxjs';
import { FileSignatureInterface } from '../../features/signature-file/models/doc-signature.interface';
import { ERROR } from '../../features/signature-validation-form/constants/error';
import { SignatureResponseInterface } from '../../models/signature-response.interface';
import { StateInterface } from '../../models/state.interface';
import { AbstractFacade } from './abstract.facade';
import {
  isRequiredSign,
  SignatureRequiredState,
} from './signature-required.state';
import { SignRoles } from '@app/shared/features/signature-file/models/sign-roles.enum';

export class SignableFacade<T> extends AbstractFacade<T> {
  constructor(
    protected geRx: GeRx,
    protected store: StateInterface | (SignatureRequiredState & StateInterface)
  ) {
    super(geRx, store);
  }

  sendForSignature(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    data: {
      files: FileSignatureInterface[];
      cancel?: boolean;
      comment?: string;
      forEmployee?: boolean;
      signInfo?: {
        provider?: string;
        password?: string;
      };
      currentRole?: SignRoles;
    } = {
      files: [],
    }
  ): void {
    throw new Error(
      "Sending request for signature method isn't overwritten in your SignableFacade"
    );
  }

  getSignatureResponse$(): Observable<
    SignatureResponseInterface | typeof ERROR
  > {
    if (isRequiredSign(this.store)) {
      return this.store.signResponse$;
    }
    throw new Error(
      "State doesn't implement SignatureRequiredState to use this method"
    );
  }
}
