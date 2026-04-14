import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { DocumentListInterface } from '../../../agreements/models/agreement.interface';

@Component({
    selector: 'app-main-agreements-dialog',
    template: '',
    styleUrls: ['./main-agreements-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class MainAgreementsDialogComponent implements OnChanges {
  @Input() unsignedAgreements: DocumentListInterface;

  @Output() showAgreementDialog = new EventEmitter();

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes?.unsignedAgreements?.previousValue) {
      this.onShowAgreementDialog();
    }
  }

  onShowAgreementDialog(): void {
    if (this.unsignedAgreements?.documents?.length) {
      this.showAgreementDialog.emit(this.unsignedAgreements?.documents);
    }
  }
}
