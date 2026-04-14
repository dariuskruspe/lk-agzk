import { Injectable } from '@angular/core';
import { CryptoProApiService } from '@shared/features/crypto-pro/shared/crypto-pro-api.service';
import { from, Observable } from 'rxjs';
import { LocalCertificateInterface } from '../models/local-certificates.interface';
import { AbstractLocalValidationService } from './abstract-local-validation.service';

@Injectable()
export class CryptoProService extends AbstractLocalValidationService {
  private readonly CRYPTOPRO_TIMEOUT: number = 120000;

  constructor(private api: CryptoProApiService) {
    super();
  }

  public getCertificate(
    thumbprint: string,
  ): Observable<LocalCertificateInterface> {
    return from(this.api.getCertificateByThumbprint(thumbprint));
  }

  public getAllCertificates(): Observable<LocalCertificateInterface[]> {
    return from(
      this.api.getAllCertificates().then(async (value) => {
        // filter certs by isValid prop
        const validCertificates: LocalCertificateInterface[] = [];

        for (const item of value) {
          if (!item.isValid) {
            continue;
          }

          if (!item.isValidDates) {
            continue;
          }

          if (!this.isCertificateAlgorithmValid(item.algorithm)) {
            continue;
          }

          validCertificates.push(item);
        }

        return validCertificates;
      }),
    );
  }

  private isCertificateAlgorithmValid(alg: string) {
    // jira PJLKS-506
    return alg !== 'RSA';
  }

  public sign(
    thumbprint: string,
    message: string | ArrayBuffer,
    isDetached: boolean = true,
  ): Observable<string> {
    return from(this.api.sign(thumbprint, message, isDetached)) as any;
  }

  public signBunch(
    thumbprint: string,
    bunch: {
      id: string;
      message: string | ArrayBuffer;
    }[],
  ): Observable<
    {
      id: string;
      signature: string;
    }[]
  > {
    return from(this.api.signBunch(thumbprint, bunch));
  }

  public isServiceWorkingCorrect(): Observable<boolean> {
    return this.api.isServiceWorkingCorrect();
  }
}
