import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  InjectionToken,
  OnInit,
} from '@angular/core';
import { CryptoProCert } from '@shared/features/crypto-pro/shared/crypto-pro-cert';
import { filterLocalCertificates } from '@shared/features/signature-validation-form/utils/filter-local-certificates.util';
import { AbstractLocalValidationService } from '@shared/features/signature-validation-form/services/abstract-local-validation.service';
import { CryptoProToken } from '@shared/features/signature-validation-form/utils/local-services.token';
import { AppService } from '@shared/services/app.service';
import { isDev } from '@shared/utilits/is-dev';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { of } from 'rxjs';
import { catchError, take } from 'rxjs/operators';
import { AgreementsEmployeePreviewFileDialogComponent } from '../agreements-employee-preview-file-dialog/agreements-employee-preview-file-dialog.component';
import { AgreementEmployeeSigningFilesFacade } from '../../facades/agreement-employee-signing-files.facade';
import { AgreementEmployeeSigningListFacade } from '../../facades/agreement-employee-signing-list.facade';
import { AgreementEmployeeFileInterface } from '../../models/agreement-employee.interface';

const localServiceToken = new InjectionToken<AbstractLocalValidationService>(
  'localService'
);

const dynamicToken: string = CryptoProToken;
@Component({
    selector: 'app-agreements-employee-list-signing-dialog',
    templateUrl: './agreements-employee-list-signing-dialog.component.html',
    styleUrls: ['./agreements-employee-list-signing-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: localServiceToken,
            useExisting: dynamicToken,
        },
    ],
    standalone: false
})
export class AgreementsEmployeeListSigningDialogComponent implements OnInit {
  certificates: CryptoProCert[] = [];

  choosenCertificate: CryptoProCert;

  providerId: string;

  providerSignType?: string;

  loading = false;

  constructor(
    @Inject(localServiceToken)
    private localService: AbstractLocalValidationService,
    private ref: ChangeDetectorRef,
    public agreementEmployeeSigningListFacade: AgreementEmployeeSigningListFacade,
    private dialog: DialogService,
    public dialogRef: DynamicDialogRef,
    public agreementEmployeeSigningFilesFacade: AgreementEmployeeSigningFilesFacade,
    public config: DynamicDialogConfig,
    private app: AppService,
  ) {}

  ngOnInit(): void {
    this.providerId = this.config.data.providerId;
    this.providerSignType = this.config.data.providerSignType;
    this.localService
      .getAllCertificates()
      .pipe(
        take(1),
        catchError((err) => {
          console.warn(err);
          return of([]);
        })
      )
      .subscribe((items) => {
        this.certificates = filterLocalCertificates({
          certificates: items,
          providerSignType: this.providerSignType,
          forEmployee: true,
          settings: this.app.settings,
          isDevMode: isDev(),
        });

        if (!this.certificates.length) {
          console.log('Локальных подписей не обнаружено');
        }

        this.ref.detectChanges();
      });
  }

  openFile(file: AgreementEmployeeFileInterface): void {
    this.dialog.open(AgreementsEmployeePreviewFileDialogComponent, {
      closable: true,
      dismissableMask: true,
      data: file,
      header: file.fileName,
      width: '500px',
    });
  }

  signFiles(): void {
    this.loading = true;
    const files = this.agreementEmployeeSigningListFacade.getData();
    this.massSignFiles(files, this.choosenCertificate).then((r) => {
      const filesList = r.map((file) => {
        return {
          fileID: file.id,
          owner: 'issue',
          signInfo: { sig: file.signature },
        };
      });
      this.agreementEmployeeSigningFilesFacade.show({
        files: filesList,
        signInfo: { provider: this.providerId },
      });
      this.agreementEmployeeSigningFilesFacade.getData$().subscribe((data) => {
        let error = false;
        data.signingData.forEach((item) => {
          if (item.errorMsg) {
            error = true;
          }
        });
        this.loading = false;
        this.dialogRef.close({ error, items: data.signingData });
      });
    });
  }

  async massSignFiles(files: AgreementEmployeeFileInterface[], certificate) {
    // Собрать массив с сфайлами формата ArrayBuffer и айдишниками файлов
    // (см как обычное локальное подписание собирает файл в arraybuffer)\
    /**
     * todo кажется что массовое подписание могут еще куда-нибудь засунуть,
     * может вынесем его в shared как общую переиспользуемую компоненту,
     * чтоб файлы определенного формата в нее закидывать и на выходе получать айдишники файлов с подписями
     * без привязки к разделу
     */
    const mappedFiles = files.map((f) => ({
      id: f.fileID,
      message: this.base64ToArrayBuffer(f.file64),
    }));
    return this.localService
      .signBunch(certificate.thumbprint, mappedFiles)
      .toPromise();
  }

  // get arraybuffer from base64
  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }
}
