import { CryptoProCert } from '@shared/features/crypto-pro/shared/crypto-pro-cert';
import { SettingsInterface } from '@shared/features/settings/models/settings.interface';

export interface FilterLocalCertificatesOptions {
  certificates: CryptoProCert[];
  providerSignType?: string;
  forEmployee: boolean;
  settings?: SettingsInterface;
  isDevMode?: boolean;
}

export function filterLocalCertificates({
  certificates,
  providerSignType,
  forEmployee,
  settings,
  isDevMode = false,
}: FilterLocalCertificatesOptions): CryptoProCert[] {
  if (isDevMode) {
    return certificates;
  }

  const useOnlyPersonal =
    forEmployee && settings?.myDocuments?.useOnlyPersonalCertificates === true;
  const useOnlyOrg =
    !forEmployee && settings?.managerDocuments?.useOnlyOrgCertificates === true;
  const isQualifiedFilter = providerSignType === 'УКЭП';

  return certificates.filter((certificate) => {
    if (certificate.isQualified !== isQualifiedFilter) {
      return false;
    }

    if (useOnlyPersonal && !certificate.isPersonal) {
      return false;
    }

    if (useOnlyOrg && certificate.isPersonal) {
      return false;
    }

    return true;
  });
}
