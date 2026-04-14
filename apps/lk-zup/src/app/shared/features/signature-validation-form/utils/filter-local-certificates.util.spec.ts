import { CryptoProCert } from '@shared/features/crypto-pro/shared/crypto-pro-cert';
import { SettingsInterface } from '@shared/features/settings/models/settings.interface';
import { filterLocalCertificates } from './filter-local-certificates.util';

describe('filterLocalCertificates', () => {
  const settings = {
    myDocuments: { enable: true, useOnlyPersonalCertificates: true },
    managerDocuments: { enable: true, useOnlyOrgCertificates: true },
  } as SettingsInterface;

  const personalQualified = {
    thumbprint: 'personal-qualified',
    isQualified: true,
    isPersonal: true,
  } as CryptoProCert;

  const orgQualified = {
    thumbprint: 'org-qualified',
    isQualified: true,
    isPersonal: false,
  } as CryptoProCert;

  const personalNonQualified = {
    thumbprint: 'personal-non-qualified',
    isQualified: false,
    isPersonal: true,
  } as CryptoProCert;

  const orgNonQualified = {
    thumbprint: 'org-non-qualified',
    isQualified: false,
    isPersonal: false,
  } as CryptoProCert;

  const certificates = [
    personalQualified,
    orgQualified,
    personalNonQualified,
    orgNonQualified,
  ];

  it('leaves only qualified certificates for УКЭП', () => {
    expect(
      filterLocalCertificates({
        certificates,
        providerSignType: 'УКЭП',
        forEmployee: true,
      }),
    ).toEqual([personalQualified, orgQualified]);
  });

  it('leaves only non-qualified certificates for non-УКЭП', () => {
    expect(
      filterLocalCertificates({
        certificates,
        providerSignType: 'НЭП',
        forEmployee: true,
      }),
    ).toEqual([personalNonQualified, orgNonQualified]);
  });

  it('leaves only personal certificates for employee flow when flag is enabled', () => {
    expect(
      filterLocalCertificates({
        certificates,
        providerSignType: 'УКЭП',
        forEmployee: true,
        settings,
      }),
    ).toEqual([personalQualified]);
  });

  it('excludes personal certificates for org flow when flag is enabled', () => {
    expect(
      filterLocalCertificates({
        certificates,
        providerSignType: 'УКЭП',
        forEmployee: false,
        settings,
      }),
    ).toEqual([orgQualified]);
  });

  it('does not apply personal or org filters when flags are disabled', () => {
    expect(
      filterLocalCertificates({
        certificates,
        providerSignType: 'УКЭП',
        forEmployee: false,
        settings: {
          myDocuments: { enable: true, useOnlyPersonalCertificates: false },
          managerDocuments: { enable: true, useOnlyOrgCertificates: false },
        } as SettingsInterface,
      }),
    ).toEqual([personalQualified, orgQualified]);
  });

  it('returns all certificates in dev mode', () => {
    expect(
      filterLocalCertificates({
        certificates,
        providerSignType: 'УКЭП',
        forEmployee: false,
        settings,
        isDevMode: true,
      }),
    ).toEqual(certificates);
  });
});
