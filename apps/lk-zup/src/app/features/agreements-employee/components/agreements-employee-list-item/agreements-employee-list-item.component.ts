import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { LangFacade } from '@shared/features/lang/facades/lang.facade';
import { LangUtils } from '@shared/features/lang/utils/lang.utils';
import { Environment } from '../../../../shared/classes/ennvironment/environment';
import { AgreementEmployeeDocumentPageInterface } from '../../models/agreement-employee-document-page.interface';
import { AgreementsEmployeeInterface } from '../../models/agreement-employee.interface';
import {
  AgreementsEmployeeDocumentStateInterface,
  AgreementsEmployeeDocumentStateItemInterface,
} from '../../models/agreements-employee-document-state.interface';
import { AgreementsEmployeeStateUtils } from '../../utils/agreements-employee-state.utils';

@Component({
    selector: 'app-agreements-employee-list-item',
    templateUrl: './agreements-employee-list-item.component.html',
    styleUrls: ['./agreements-employee-list-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class AgreementsEmployeeListItemComponent {
  apiUrl = Environment.inv().api;

  @Input() dataList: AgreementsEmployeeInterface;

  @Input() otherData: AgreementsEmployeeDocumentStateInterface;

  @Output() clickItem = new EventEmitter();

  constructor(
    public langUtils: LangUtils,
    public langFacade: LangFacade,
    private agreementsEmployeeStateUtils: AgreementsEmployeeStateUtils
  ) {}

  onClick(item: AgreementEmployeeDocumentPageInterface): void {
    this.clickItem.emit(item);
  }

  findWorkStatus(state: string): AgreementsEmployeeDocumentStateItemInterface {
    return this.agreementsEmployeeStateUtils.getItem(this.otherData, state);
  }
}
