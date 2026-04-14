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
import { AppService } from '@shared/services/app.service';
import { logDebug, logError } from '@shared/utilits/logger';
import { isDev } from '@shared/utilits/is-dev';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { of } from 'rxjs';
import { catchError, take } from 'rxjs/operators';
import { AbstractLocalValidationService } from '../../../../shared/features/signature-validation-form/services/abstract-local-validation.service';
import { CryptoProToken } from '../../../../shared/features/signature-validation-form/utils/local-services.token';
import { AgreementSigningFilesFacade } from '../../facades/agreement-signing-files.facade';
import { AgreementSigningListFacade } from '../../facades/agreement-signing-list.facade';
import { AgreementFileInterface } from '../../models/agreement.interface';
import { AgreementsPreviewFileDialogComponent } from '../agreements-preview-file-dialog/agreements-preview-file-dialog.component';
import { DocumentInterface } from '@features/agreements/models/document.interface';

const localServiceToken = new InjectionToken<AbstractLocalValidationService>(
  'localService',
);

const dynamicToken: string = CryptoProToken;
@Component({
    selector: 'app-agreements-list-signing-dialog',
    templateUrl: './agreements-list-signing-dialog.component.html',
    styleUrls: ['./agreements-list-signing-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: localServiceToken,
            useExisting: dynamicToken,
        },
    ],
    standalone: false
})
export class AgreementsListSigningDialogComponent implements OnInit {
  certificates: CryptoProCert[] = [];

  choosenCertificate: string;

  providerId: string;

  providerSignType?: string;

  localSigning = true;

  documents: DocumentInterface[];

  loading = false;

  constructor(
    @Inject(localServiceToken)
    private localService: AbstractLocalValidationService,
    private ref: ChangeDetectorRef,
    public agreementSigningListFacade: AgreementSigningListFacade,
    private dialog: DialogService,
    public dialogRef: DynamicDialogRef,
    public agreementSigningFilesFacade: AgreementSigningFilesFacade,
    public config: DynamicDialogConfig,
    private app: AppService,
  ) {}

  ngOnInit(): void {
    this.providerId = this.config.data.providerId;
    this.providerSignType = this.config.data.providerSignType;
    this.localSigning = this.config.data.localSigning;
    this.documents = this.config.data.documents;
    if (this.localSigning) {
      this.localService
        .getAllCertificates()
        .pipe(
          take(1),
          catchError((err) => {
            logError(err);
            return of([]);
          }),
        )
        .subscribe((items) => {
          this.certificates = filterLocalCertificates({
            certificates: items,
            providerSignType: this.providerSignType,
            forEmployee: false,
            settings: this.app.settings,
            isDevMode: isDev(),
          });

          if (!this.certificates.length) {
            logDebug('Локальных подписей не обнаружено');
          }

          this.ref.detectChanges();
        });
    }
  }

  openFile(file: AgreementFileInterface): void {
    this.dialog.open(AgreementsPreviewFileDialogComponent, {
      closable: true,
      dismissableMask: true,
      data: file,
      header: file.fileName,
      width: '500px',
    });
  }

  async signFiles(): Promise<void> {
    this.loading = true;
    const files = this.agreementSigningListFacade.getData();
    if (this.localSigning) {
      this.massSignFiles(files, this.choosenCertificate).then(async (r) => {
        const filesList = r.map((file) => {
          const owner = this.documents.find(f => f.fileID === file.id).fileOwner;
          return {
            fileID: file.id,
            owner,
            signInfo: { sig: file.signature },
          };
        });
        await this.agreementSigningFilesFacade.show({
          files: filesList,
          signInfo: { provider: this.providerId },
        });
        this.agreementSigningFilesFacade.getData$().subscribe((data) => {
          let error = false;
          data.signingData.forEach((item) => {
            if (item.errorMsg) {
              error = true;
            }
          });
          this.loading = false;
          this.dialogRef.close({
            error,
            items: data.signingData,
            displayConfirmationCodeWindow: data?.displayConfirmationCodeWindow,
          });
        });
      });
    } else {
      const filesList = this.agreementSigningListFacade
        .getData()
        .map((file) => {
          const owner = this.documents.find(f => f.fileID === file.fileID).fileOwner;
          return {
            fileID: file.fileID,
            owner,
            signInfo: { sig: '' },
          };
        });
      await this.agreementSigningFilesFacade.show({
        files: filesList,
        signInfo: { provider: this.providerId },
      });
      this.agreementSigningFilesFacade.getData$().subscribe((data) => {
        let error = false;
        data.signingData.forEach((item) => {
          if (item.errorMsg) {
            error = true;
          }
        });
        this.loading = false;
        this.dialogRef.close({
          error,
          items: data.signingData,
          displayConfirmationCodeWindow: data.displayConfirmationCodeWindow,
        });
      });
    }
  }

  async massSignFiles(files: AgreementFileInterface[], certificate: string) {
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
    return this.localService.signBunch(certificate, mappedFiles).toPromise();
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
