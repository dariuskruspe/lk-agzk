import { Injectable } from '@angular/core';
import { CryptoProCert } from '@shared/features/crypto-pro/shared/crypto-pro-cert';
import {
  createAttachedSignature,
  createDetachedSignature,
  createHash,
  getCertificate,
  getUserCertificates,
  isValidSystemSetup,
} from 'crypto-pro';
import { Observable, timer } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CryptoProApiService {
  private readonly CRYPTOPRO_TIMEOUT: number = 120000;

  constructor() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.cadesplugin_load_timeout = this.CRYPTOPRO_TIMEOUT;
  }

  public async getCertificateByThumbprint(thumbprint: string) {
    const cert = await getCertificate(thumbprint);
    return CryptoProCert.fromCertificate(cert);
  }

  public async getAllCertificates() {
    const certs = await getUserCertificates();

    const out: CryptoProCert[] = [];

    for (const cert of certs) {
      try {
        const item = await CryptoProCert.fromCertificate(cert);
        out.push(item);
      } catch (e) {
        console.log('error cert', e);
      }
    }

    return out;
  }

  public sign(
    thumbprint: string,
    message: string | ArrayBuffer,
    isDetached: boolean = true,
  ) {
    return this.createSignature(thumbprint, message, isDetached);
  }

  public async signBunch(
    thumbprint: string,
    bunch: {
      id: string;
      message: string | ArrayBuffer;
    }[],
  ): Promise<
    {
      id: string;
      signature: string;
    }[]
  > {
    const signed: Promise<string>[] = [];
    for (let i = 0; i < bunch.length; i++) {
      signed.push(
        this.createSignature(
          thumbprint,
          bunch[i].message,
          true,
        ) as Promise<string>,
      );
    }
    const all = await Promise.all(signed);

    return all.map((signature, i) => ({ id: bunch[i].id, signature }));
  }

  public isServiceWorkingCorrect(): Observable<boolean> {
    return new Observable((subscriber) => {
      let isResolved = false;
      const timerSub = timer(this.CRYPTOPRO_TIMEOUT)
        .pipe(take(1))
        .subscribe(() => {
          if (!isResolved) {
            subscriber.next(false);
            subscriber.complete();
          }
          isResolved = true;
        });
      isValidSystemSetup()
        .then((value: boolean) => {
          if (!isResolved) {
            subscriber.next(value);
            subscriber.complete();
          }
          timerSub.unsubscribe();
          isResolved = true;
        })
        .catch((error) => {
          if (!isResolved) {
            subscriber.error(error);
          }
          timerSub.unsubscribe();
          isResolved = true;
          throw error;
        });
    });
  }

  private async createSignature(
    thumbprint: string,
    message: string | ArrayBuffer,
    isDetached: boolean,
  ): Promise<Error | string> {
    let hash: null | string = null;
    let signature: string | null = null;

    try {
      hash = await createHash(message);
      signature = isDetached
        ? await createDetachedSignature(thumbprint, hash)
        : await createAttachedSignature(thumbprint, message);
      return signature;
    } catch (error) {
      return Promise.reject(new Error(error));
    }
  }
}
