import { CommonModule } from '@angular/common';
import { Pipe, PipeTransform, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { CryptoProCert } from '@shared/features/crypto-pro/shared/crypto-pro-cert';
import { CryptoProToken } from '@shared/features/signature-validation-form/utils/local-services.token';
import { AppService } from '@shared/services/app.service';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { of } from 'rxjs';
import { AgreementSigningFilesFacade } from '../../facades/agreement-signing-files.facade';
import { AgreementSigningListFacade } from '../../facades/agreement-signing-list.facade';
import { AgreementsListSigningDialogComponent } from './agreements-list-signing-dialog.component';

@Pipe({ name: 'translate', standalone: false })
class MockTranslatePipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

describe('AgreementsListSigningDialogComponent', () => {
  let component: AgreementsListSigningDialogComponent;
  let fixture: ComponentFixture<AgreementsListSigningDialogComponent>;

  const createCertificate = (
    thumbprint: string,
    isQualified: boolean,
    isPersonal: boolean,
  ): CryptoProCert =>
    ({
      thumbprint,
      isQualified,
      isPersonal,
      validFrom: '2024-01-01',
      validTo: '2025-01-01',
      issuerName: 'issuer',
      subjectName: 'subject',
      subjectPersonName: 'person',
      subjectOrgName: 'org',
    }) as CryptoProCert;

  const baseConfig = {
    data: {
      providerId: 'provider-id',
      providerSignType: 'УКЭП',
      localSigning: true,
      documents: [{ fileID: '1', fileOwner: 'agreement' }],
    },
  };

  const agreementSigningListFacadeMock = {
    loading$: jest.fn(() => of(false)),
    getData$: jest.fn(() => of([{ fileID: '1', fileName: 'file.pdf' }])),
    getData: jest.fn(() => [{ fileID: '1', fileName: 'file.pdf' }]),
  };

  const agreementSigningFilesFacadeMock = {
    show: jest.fn(),
    getData$: jest.fn(() => of({ signingData: [] })),
  };

  const dialogRefMock = {
    close: jest.fn(),
  };

  const dialogServiceMock = {
    open: jest.fn(),
  };

  const appServiceMock = {
    settings: {
      myDocuments: { enable: true, useOnlyPersonalCertificates: false },
      managerDocuments: { enable: true, useOnlyOrgCertificates: true },
    },
  };

  const setup = async (
    certificates: CryptoProCert[],
    configData = baseConfig.data,
  ) => {
    const localServiceMock = {
      getAllCertificates: jest.fn(() => of(certificates)),
      signBunch: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [
        AgreementsListSigningDialogComponent,
        MockTranslatePipe,
      ],
      imports: [CommonModule, FormsModule],
      providers: [
        { provide: CryptoProToken, useValue: localServiceMock },
        {
          provide: AgreementSigningListFacade,
          useValue: agreementSigningListFacadeMock,
        },
        {
          provide: AgreementSigningFilesFacade,
          useValue: agreementSigningFilesFacadeMock,
        },
        { provide: DialogService, useValue: dialogServiceMock },
        { provide: DynamicDialogConfig, useValue: { data: configData } },
        { provide: DynamicDialogRef, useValue: dialogRefMock },
        {
          provide: AppService,
          useValue: appServiceMock,
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AgreementsListSigningDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    return { localServiceMock };
  };

  beforeEach(() => {
    jest.clearAllMocks();
    TestBed.resetTestingModule();
  });

  it('filters org certificates for bulk org signing', async () => {
    await setup([
      createCertificate('personal-qualified', true, true),
      createCertificate('org-qualified', true, false),
    ]);

    expect(component.certificates.map((cert) => cert.thumbprint)).toEqual([
      'org-qualified',
    ]);
  });

  it('shows empty certificates message when nothing is left after filtering', async () => {
    await setup([createCertificate('personal-qualified', true, true)]);

    expect(component.certificates).toEqual([]);
    expect(fixture.nativeElement.textContent).toContain('EMPTY_CERTIFICATES');
  });
});
