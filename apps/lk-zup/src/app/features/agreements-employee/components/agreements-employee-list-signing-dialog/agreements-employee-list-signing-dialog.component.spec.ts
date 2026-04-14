import { CommonModule } from '@angular/common';
import {
  Component,
  forwardRef,
  Input,
  NO_ERRORS_SCHEMA,
  Pipe,
  PipeTransform,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CryptoProCert } from '@shared/features/crypto-pro/shared/crypto-pro-cert';
import { CryptoProToken } from '@shared/features/signature-validation-form/utils/local-services.token';
import { AppService } from '@shared/services/app.service';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { of } from 'rxjs';
import { AgreementEmployeeSigningFilesFacade } from '../../facades/agreement-employee-signing-files.facade';
import { AgreementEmployeeSigningListFacade } from '../../facades/agreement-employee-signing-list.facade';
import { AgreementsEmployeeListSigningDialogComponent } from './agreements-employee-list-signing-dialog.component';

@Pipe({ name: 'translate', standalone: false })
class MockTranslatePipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

@Component({
  selector: 'p-dropdown',
  template: '',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MockDropdownComponent),
      multi: true,
    },
  ],
  standalone: false,
})
class MockDropdownComponent implements ControlValueAccessor {
  @Input() options: unknown[];

  @Input() optionLabel: string;

  @Input() placeholder: string;

  @Input() class: string;

  @Input() appendTo: string;

  writeValue(): void {}

  registerOnChange(): void {}

  registerOnTouched(): void {}
}

describe('AgreementsEmployeeListSigningDialogComponent', () => {
  let component: AgreementsEmployeeListSigningDialogComponent;
  let fixture: ComponentFixture<AgreementsEmployeeListSigningDialogComponent>;

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

  const agreementEmployeeSigningListFacadeMock = {
    loading$: jest.fn(() => of(false)),
    getData$: jest.fn(() => of([{ fileID: '1', fileName: 'file.pdf' }])),
    getData: jest.fn(() => [{ fileID: '1', fileName: 'file.pdf' }]),
  };

  const agreementEmployeeSigningFilesFacadeMock = {
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
      myDocuments: { enable: true, useOnlyPersonalCertificates: true },
      managerDocuments: { enable: true, useOnlyOrgCertificates: false },
    },
  };

  const setup = async (certificates: CryptoProCert[]) => {
    const localServiceMock = {
      getAllCertificates: jest.fn(() => of(certificates)),
      signBunch: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [
        AgreementsEmployeeListSigningDialogComponent,
        MockDropdownComponent,
        MockTranslatePipe,
      ],
      imports: [CommonModule, FormsModule],
      providers: [
        { provide: CryptoProToken, useValue: localServiceMock },
        {
          provide: AgreementEmployeeSigningListFacade,
          useValue: agreementEmployeeSigningListFacadeMock,
        },
        {
          provide: AgreementEmployeeSigningFilesFacade,
          useValue: agreementEmployeeSigningFilesFacadeMock,
        },
        { provide: DialogService, useValue: dialogServiceMock },
        {
          provide: DynamicDialogConfig,
          useValue: {
            data: {
              providerId: 'provider-id',
              providerSignType: 'УКЭП',
            },
          },
        },
        { provide: DynamicDialogRef, useValue: dialogRefMock },
        { provide: AppService, useValue: appServiceMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(
      AgreementsEmployeeListSigningDialogComponent,
    );
    component = fixture.componentInstance;
    fixture.detectChanges();

    return { localServiceMock };
  };

  beforeEach(() => {
    jest.clearAllMocks();
    TestBed.resetTestingModule();
  });

  it('filters personal certificates for bulk employee signing', async () => {
    await setup([
      createCertificate('personal-qualified', true, true),
      createCertificate('org-qualified', true, false),
    ]);

    expect(component.certificates.map((cert) => cert.thumbprint)).toEqual([
      'personal-qualified',
    ]);
  });

  it('shows empty certificates message when nothing is left after filtering', async () => {
    await setup([createCertificate('org-qualified', true, false)]);

    expect(component.certificates).toEqual([]);
    expect(fixture.nativeElement.textContent).toContain('EMPTY_CERTIFICATES');
  });
});
