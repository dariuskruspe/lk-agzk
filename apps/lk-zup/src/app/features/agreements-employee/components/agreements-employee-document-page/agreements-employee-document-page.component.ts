import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { AgreementEmployeeDocumentPageInterface } from '../../models/agreement-employee-document-page.interface';

@Component({
    selector: 'app-agreements-employee-document-page',
    templateUrl: './agreements-employee-document-page.component.html',
    styleUrls: ['./agreements-employee-document-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class AgreementsEmployeeDocumentPageComponent {
  @Input() document: AgreementEmployeeDocumentPageInterface;

  @Output() backPage = new EventEmitter();

  @Output() oncloseFile = new EventEmitter<unknown>();

  onBackPage(): void {
    this.backPage.emit();
  }

  closeFile(result: unknown): void {
    this.oncloseFile.emit(result);
  }
}
