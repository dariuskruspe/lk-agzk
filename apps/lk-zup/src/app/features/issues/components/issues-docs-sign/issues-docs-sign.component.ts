import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemListBuilderInterface } from '../../../../shared/components/item-list-builder/models/item-list-builder.interface';
import { DocumentStatesInterface } from '../../../agreements/models/document-states.interface';
import {
  WIDGET_DOCUMENTS_DATA_CONFIG,
  WIDGET_DOCUMENTS_ITEM_LAYOUT,
} from '../../../dashboard/constants/documents-widget-config';
import { IssuesDocSignInterface } from '../../models/issues-doc-sign.interface';

@Component({
    selector: 'app-issues-docs-sign',
    templateUrl: './issues-docs-sign.component.html',
    styleUrls: ['./issues-docs-sign.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class IssuesDocsSignComponent implements OnChanges {
  @Input() docSignList: IssuesDocSignInterface[];

  @Input() stateList: DocumentStatesInterface;

  @Input() isRequiringApproval;

  @Input() loading: boolean;

  @Input() downloading;

  @Input() isDraft;

  @Output() docOnClick = new EventEmitter<IssuesDocSignInterface>();

  @Output() downloadArch = new EventEmitter();

  public dataConfig: ItemListBuilderInterface[] = WIDGET_DOCUMENTS_DATA_CONFIG;

  dataLayout = WIDGET_DOCUMENTS_ITEM_LAYOUT;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes.docSignList?.currentValue?.length &&
      this.isDraft &&
      this.stateList
    ) {
      const needToSign = this.docSignList.find(
        (doc) =>
          this.stateList.documentsStates.find((state) => state.id === doc.state)
            ?.sign === false
      );
      if (needToSign) {
        this.openSignature(needToSign);
      } else {
        this.router.navigate([], {
          relativeTo: this.activatedRoute,
          queryParams: {},
        });
      }
    }
  }

  openSignature(doc: IssuesDocSignInterface): void {
    this.docOnClick.emit(doc);
  }

  onDownloadArch(): void {
    this.downloadArch.emit();
  }
}
