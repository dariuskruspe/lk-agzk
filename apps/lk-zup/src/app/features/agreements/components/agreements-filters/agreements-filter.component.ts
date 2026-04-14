import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import {
  DocumentTypesInterface,
  DocumentFilterInterface,
} from '@features/agreements/models/agreement.interface';
import { DocumentStatesInterface } from '@features/agreements/models/document-states.interface';
import { FpcOptionListItemInterface } from '@wafpc/base/models/fpc.interface';
import { OverlayOptions } from 'primeng/api';
import { DomHandler } from 'primeng/dom';
import { Dropdown } from 'primeng/dropdown';

@Component({
    selector: 'app-agreements-filter',
    templateUrl: './agreements-filter.component.html',
    styleUrls: ['./agreements-filter.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class AgreementsFilterComponent {
  @Input() filterValue: DocumentFilterInterface;

  @Input() daysValueList: FpcOptionListItemInterface[];

  @Input() stateList: DocumentStatesInterface;

  @Input() documentTypesList: DocumentTypesInterface;

  @Input() selectedType:
    | {
        documentsTypeID: string;
        documentsTypeName: string;
        documentsTypeValues: string;
      }
    | undefined;

  @Output() applyFilters = new EventEmitter();

  /**
   * Общие (для всех фильтров) настройки отображения оверлеев.
   */
  overlayOptions: OverlayOptions | undefined = {
    contentStyle: {
      'max-width': '90vw',
    },
  };

  @ViewChild('docTypeDD') docTypeDropdown: Dropdown;

  docTypeFilterOverlayOptions: OverlayOptions | undefined;

  /**
   * Инициализируем параметры отображения оверлея (выпадающей панели) указанного фильтра.
   *
   * См. https://github.com/primefaces/primeng/issues/16011
   *
   * @param filterName название фильтра, для которого инициализируем параметры отображения оверлея
   */
  initFilterOverlayOptions(filterName: string): void {
    if (filterName === 'docType') {
      this.docTypeFilterOverlayOptions = {
        ...this.overlayOptions,
        contentStyle: {
          'max-width': DomHandler.getOuterWidth(this.docTypeDropdown.el.nativeElement) + 'px',
        },
      };
    }
  }

  onDocTypeDDShow(): void {
    this.initFilterOverlayOptions('docType');
  }
}
