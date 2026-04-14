import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { take, takeUntil } from 'rxjs/operators';
import { CreationSignatureApiService } from '../../../signature-creation-form/services/creation-signature-api.service';
import { AbstractValidationComponent } from '../../components/abstract-validation/abstract-validation.component';

@Component({
    templateUrl: './sms-validation-container.component.html',
    styleUrls: ['./sms-validation-container.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class SmsValidationContainerComponent extends AbstractValidationComponent {
  confirmationSent = false;

  private readonly fileInfo: {
    fileID: string;
    fileOwner: string;
    file64?: string;
  };

  constructor(
    protected config: DynamicDialogConfig,
    protected dialogRef: DynamicDialogRef,
    private signatureApi: CreationSignatureApiService,
  ) {
    super(config, dialogRef);
    this.fileInfo = this.config.data.fileInfo;
  }

  onCodeReceived(code: string): void {
    this.confirmationSent = true;
    this.signatureApi
      .sendConfirmCode({
        action: 'signingConfirmBySMS',
        code,
        objectID: this.fileInfo?.fileID,
        cancelled: false,
      })
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe(
        () => {
          this.confirm();
        },
        () => {},
        () => {
          this.confirmationSent = false;
          this.dialogRef.close();
        },
      );
  }
}
