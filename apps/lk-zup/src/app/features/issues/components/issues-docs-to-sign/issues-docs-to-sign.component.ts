import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { DocumentStatesInterface } from '@features/agreements/models/document-states.interface';
import { IssuesDocSignInterface } from '@features/issues/models/issues-doc-sign.interface';

@Component({
  selector: 'app-issues-docs-to-sign',
  templateUrl: './issues-docs-to-sign.component.html',
  styleUrls: ['./issues-docs-to-sign.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class IssuesDocsToSignComponent {
  @Input() docSignList: IssuesDocSignInterface[];
  @Input() stateList: DocumentStatesInterface;
  @Input() loading: boolean;

  @Output() docOnClick = new EventEmitter<IssuesDocSignInterface>();

  get docsToSign(): IssuesDocSignInterface[] {
    if (!this.docSignList?.length || !this.stateList?.documentsStates?.length) {
      return [];
    }
    return this.docSignList.filter((doc) => {
      const docState = this.stateList.documentsStates.find(
        (state) => state.id === doc.state
      );
      return docState?.sign === false;
    });
  }

  openSignature(doc: IssuesDocSignInterface): void {
    this.docOnClick.emit(doc);
  }
}
