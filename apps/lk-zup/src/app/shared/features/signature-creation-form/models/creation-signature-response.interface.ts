import { SignatureResponseInterface } from '../../../models/signature-response.interface';

export function hasSecondStep(T: unknown): T is SignatureResponseInterface {
  return (
    typeof T === 'object' &&
    (T as SignatureResponseInterface)?.message !== undefined
  );
}
