import { CryptoGost as nodeGost } from '@wavesenterprise/crypto-gost-js';
import { Certificate } from 'crypto-pro';
import moment from 'moment/moment';
import AUTHORIZED_CAS from './authorized_cas';

const AUTHORIZED_OGRNS = AUTHORIZED_CAS.map((i) => i.ogrn);

// ОГРН Минцифры
const ROOT_OGRN = '1047702026701';

export class CryptoProCert {
  readonly isValid: boolean;

  readonly isValidDates: boolean;

  readonly algorithm: string;

  readonly isQualified: boolean;

  readonly crt: any;

  readonly subjectPersonName: string;

  readonly subjectOrgName: string;

  readonly thumbprint: string;

  readonly validFrom: string;

  readonly validTo: string;

  readonly issuerName: string;

  readonly subjectName: string;

  readonly isPersonal: boolean;

  constructor(
    private cert: Certificate,
    props: Partial<CryptoProCert>,
  ) {
    Object.assign(this, props);
  }

  static async fromCertificate(cert: Certificate) {
    const [isValid, alg, base64] = await Promise.all([
      cert.isValid(),
      cert.getAlgorithm(),
      cert.exportBase64(),
    ]);

    const crt = this.parseCrt(base64);

    const { subjectPersonName, subjectOrgName } = this.getCrtCommonInfo(crt);

    const isPersonal = this.isPersonal(crt);

    return new CryptoProCert(cert, {
      isValid,
      algorithm: alg.algorithm,
      isValidDates: this.isValidDates(cert),
      crt,
      isQualified: this.isQualified(cert, crt),
      subjectPersonName: subjectPersonName ?? cert.name,
      subjectOrgName,
      thumbprint: cert.thumbprint,
      validFrom: cert.validFrom,
      validTo: cert.validTo,
      issuerName: cert.issuerName,
      subjectName: cert.subjectName,
      isPersonal: isPersonal,
    });
  }

  private static isValidDates(cert: Certificate) {
    const validFrom = moment(cert.validFrom);
    const validTo = moment(cert.validTo);
    const now = moment();
    return now.isBetween(validFrom, validTo);
  }

  private static getCrtCommonInfo(crt: any) {
    const { subject } = crt;

    let subjectPersonName = '';
    let subjectOrgName = '';

    if (subject['2.5.4.4']) {
      subjectPersonName = `${subject['2.5.4.4']} ${subject.givenName}`.trim();
      subjectOrgName = subject.organizationName;
    }

    return { subjectPersonName, subjectOrgName };
  }

  private static parseCrt(base64: string) {
    console.log('base64', base64);
    const crt = nodeGost.asn1.Certificate.decode(
      nodeGost.coding.Base64.decode(base64),
    );

    return crt;
  }

  private static isQualified(cert: Certificate, crt: any) {
    const { issuer } = crt;

    // если сертификат выпущен авторизованным центром сертификации, то это УКЭП
    if (issuer.OGRN && AUTHORIZED_OGRNS.includes(issuer.OGRN)) {
      return true;
    }

    // если сертификат выпущен минцифры, то это УКЭП
    if (issuer.OGRN && issuer.OGRN === ROOT_OGRN) {
      return true;
    }

    // если указан центр сертификации
    let isQualified = false;
    const authorityCertIssuer =
      crt.extensions?.authorityKeyIdentifier?.authorityCertIssuer;
    // если сертификат подписан минцифры, то это УКЭП
    if (authorityCertIssuer && Array.isArray(authorityCertIssuer)) {
      isQualified = authorityCertIssuer.some((i) => i.OGRN === ROOT_OGRN);
    }

    return isQualified;
  }

  private static isPersonal(crt: any) {
    return !crt.subject.OGRNIP && !crt.subject.OGRN;
  }
}
