import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LangFacade } from '@shared/features/lang/facades/lang.facade';
import { TranslatePipe } from '@shared/features/lang/pipes/lang.pipe';
import { LangUtils } from '@shared/features/lang/utils/lang.utils';
import { MessageSnackbarService } from '@shared/features/message-snackbar/message-snackbar.service';
import { MessageType } from '@shared/features/message-snackbar/models/message-type.enum';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AgreementEmployeeDocumentPageInterface } from '../../models/agreement-employee-document-page.interface';

@Component({
    selector: 'app-agreements-employee-document-dialog-container',
    templateUrl: './agreements-employee-document-dialog-container.component.html',
    styleUrls: ['./agreements-employee-document-dialog-container.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [TranslatePipe],
    standalone: false
})
export class AgreementsEmployeeDocumentDialogContainerComponent {
  data: {
    document: AgreementEmployeeDocumentPageInterface;
    isShowMode: boolean;
  };

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
          this.translatePipe.transform(
            'AGREEMENT_EMPLOYEE_WARNING_MESSAGE_P1'
          ) + this.data.document.name,
          MessageType.warn
        );
      } else {
        this.messageSnackbarService.show(
          `${this.translatePipe.transform('AGREEMENT_EMPLOYEE_DATE')} ${
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
}
