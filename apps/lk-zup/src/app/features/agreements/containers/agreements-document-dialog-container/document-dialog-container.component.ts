import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  WritableSignal,
} from '@angular/core';
import { DocumentInterface } from '@features/agreements/models/document.interface';
import { LangFacade } from '@shared/features/lang/facades/lang.facade';
import { TranslatePipe } from '@shared/features/lang/pipes/lang.pipe';
import { LangUtils } from '@shared/features/lang/utils/lang.utils';
import { MessageSnackbarService } from '@shared/features/message-snackbar/message-snackbar.service';
import { MessageType } from '@shared/features/message-snackbar/models/message-type.enum';
import { UserStorageInterface } from '@shared/interfaces/storage/user/user-storage.interface';
import { AppService } from '@shared/services/app.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
    selector: 'app-document-dialog-container',
    templateUrl: './document-dialog-container.component.html',
    styleUrls: ['./document-dialog-container.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [TranslatePipe],
    standalone: false
})
export class DocumentDialogContainerComponent implements OnDestroy {
  data: { document: DocumentInterface; isShowMode: boolean };

  app: AppService = inject(AppService);

  currentUserStorage: UserStorageInterface = this.app.storage.user.current;

  openDocumentSignal: WritableSignal<DocumentInterface> =
    this.currentUserStorage.data.frontend.signal.openDocument;

  openDocumentFileUint8ArraySignal: WritableSignal<Uint8Array> =
    this.currentUserStorage.data.frontend.signal.openDocumentFileUint8Array;

  constructor(
    public config: DynamicDialogConfig,
    public dialogRef: DynamicDialogRef,
    public langFacade: LangFacade,
    public langUtils: LangUtils,
    private translatePipe: TranslatePipe,
    private messageSnackbarService: MessageSnackbarService
  ) {
    this.data = { ...this.config?.data };
    this.config.data = this.data.document;
    if (this.data.document.mandatory) {
      if (!this.data.isShowMode) {
        this.messageSnackbarService.show(
          this.translatePipe.transform('AGREEMENT_WARNING_MESSAGE_P1') +
            this.data.document.name,
          MessageType.warn
        );
      } else {
        this.messageSnackbarService.show(
          `${this.translatePipe.transform('AGREEMENT_DATE')} ${
            this.data.document.stateDate
          }`,
          MessageType.warn
        );
      }
    }
  }

  closeFile(result: unknown): void {
    this.dialogRef.close(result);
  }

  ngOnDestroy(): void {
    this.openDocumentSignal.set(null);
    this.openDocumentFileUint8ArraySignal.set(null);
  }
}
