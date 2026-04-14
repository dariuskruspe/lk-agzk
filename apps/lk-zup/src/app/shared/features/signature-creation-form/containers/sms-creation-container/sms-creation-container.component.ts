import { ChangeDetectionStrategy, Component } from '@angular/core';
import { take, takeUntil } from 'rxjs/operators';
import { AbstractCreationComponent } from '../../components/abstract-creation/abstract-creation.component';
import { CreationSignatureApiService } from '../../services/creation-signature-api.service';

@Component({
    templateUrl: './sms-creation-container.component.html',
    styleUrls: ['./sms-creation-container.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class SmsCreationContainerComponent extends AbstractCreationComponent {
  confirmationSent = false;

  constructor(private signatureApi: CreationSignatureApiService) {
    super();
  }

  onCodeReceived(code: string): void {
    this.confirmationSent = true;
    this.signatureApi
      .sendConfirmCode({
        action: 'signatureReleaseConfirmBySMS',
        code,
        objectID: this.response?.requestID,
        cancelled: false,
      })
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe(
        () => {
          this.close();
        },
        () => {},
        () => {
          this.confirmationSent = false;
        }
      );
  }
}
