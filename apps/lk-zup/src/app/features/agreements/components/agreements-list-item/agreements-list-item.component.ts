import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Environment } from '../../../../shared/classes/ennvironment/environment';
import { LangFacade } from '../../../../shared/features/lang/facades/lang.facade';
import { LangUtils } from '../../../../shared/features/lang/utils/lang.utils';
import { DocumentInterface } from '../../models/document.interface';
import { DocumentListInterface } from '../../models/agreement.interface';
import {
  DocumentStatesInterface,
  DocumentStateInterface,
} from '../../models/document-states.interface';
import { AgreementsStateUtils } from '../../utils/agreements-state.utils';

@Component({
  selector: 'app-agreements-list-item',
  templateUrl: './agreements-list-item.component.html',
  styleUrls: ['./agreements-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgreementsListItemComponent {
  apiUrl = Environment.inv().api;

  @Input() dataList: DocumentListInterface;

  @Input() otherData: DocumentStatesInterface;

  @Output() clickItem = new EventEmitter();

  constructor(
    public langUtils: LangUtils,
    public langFacade: LangFacade,
    private agreementsStateUtils: AgreementsStateUtils
  ) {}

  onClick(item: DocumentInterface): void {
    this.clickItem.emit(item);
  }

  findWorkStatus(state: string): DocumentStateInterface {
    return this.agreementsStateUtils.getItem(this.otherData, state);
  }
}
