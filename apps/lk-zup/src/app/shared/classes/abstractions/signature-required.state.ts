import { Observable, of, Subject } from 'rxjs';
import { ERROR } from '../../features/signature-validation-form/constants/error';
import { SignatureResponseInterface } from '../../models/signature-response.interface';

export class SignatureRequiredState {
  protected signResponse = new Subject<
    SignatureResponseInterface | typeof ERROR
  >();

  onSignSuccess(
    result: any & SignatureResponseInterface
  ): Observable<SignatureResponseInterface> {
    this.signResponse.next(result);
    return of(result);
  }

  onSignError(): Observable<unknown> {
    this.signResponse.next(ERROR);
    return of(ERROR);
  }

  get signResponse$(): Observable<SignatureResponseInterface | typeof ERROR> {
    return this.signResponse.asObservable();
  }
}

export function isRequiredSign(T: unknown): T is SignatureRequiredState {
  return (T as SignatureRequiredState).signResponse$ !== undefined;
}
