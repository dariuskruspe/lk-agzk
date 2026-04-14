import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SignatureResponseInterface } from '../../../../models/signature-response.interface';
import { AbstractValidationComponent } from '../abstract-validation/abstract-validation.component';

@Component({
    selector: 'app-additional-message',
    templateUrl: './additional-message.component.html',
    styleUrls: ['./additional-message.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class AdditionalMessageComponent extends AbstractValidationComponent {
  @Input() closable = true;

  @Input() set res(value: SignatureResponseInterface) {
    this.response = value;
  }
}
