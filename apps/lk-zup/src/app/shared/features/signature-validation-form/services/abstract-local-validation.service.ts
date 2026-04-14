import { Observable } from 'rxjs';
import { LocalCertificateInterface } from '../models/local-certificates.interface';

export abstract class AbstractLocalValidationService {
  public abstract getCertificate(
    thumbprint: string
  ): Observable<LocalCertificateInterface>;

  public abstract getAllCertificates(): Observable<LocalCertificateInterface[]>;

  public abstract sign(
    thumbprint: string,
    message: unknown,
    isDetached?: boolean
  ): Observable<string>;

  // detached only
  public abstract signBunch(
    thumbprint: string,
    bunch: {
      id: string;
      message: unknown;
    }[]
  ): Observable<
    {
      id: string;
      signature: string;
    }[]
  >;

  public abstract isServiceWorkingCorrect(): Observable<boolean>;
}
