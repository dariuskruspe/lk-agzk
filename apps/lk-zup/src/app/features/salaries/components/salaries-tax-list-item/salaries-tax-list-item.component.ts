import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { ItemListBuilderInterface } from '../../../../shared/components/item-list-builder/models/item-list-builder.interface';
import { LangFacade } from '../../../../shared/features/lang/facades/lang.facade';
import { LangUtils } from '../../../../shared/features/lang/utils/lang.utils';
import { IssuesStatusInterface } from '../../../issues/models/issues.interface';
import {
  TAX_DATA_CONFIG,
  TAX_ITEM_LAYOUT,
} from '../../constants/tax-data-config';
import { TaxListInterface } from '../../models/salaries-tax.interface';

@Component({
    selector: 'app-salaries-tax-list-item',
    templateUrl: './salaries-tax-list-item.component.html',
    styleUrls: ['./salaries-tax-list-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class SalariesTaxListItemComponent {
  dataConfig: ItemListBuilderInterface[] = TAX_DATA_CONFIG;

  dataLayout = TAX_ITEM_LAYOUT;

  issuesViewToggle = false;

  @Input() loading: boolean;

  @Input() dataList: TaxListInterface;

  @Input() otherData: {
    taxStateList: IssuesStatusInterface;
  };

  @Output() clickItem = new EventEmitter<string>();

  constructor(public langFacade: LangFacade, public langUtils: LangUtils) {}

  logIssueDetails(issue: { issueID: string }): void {
    this.clickItem.emit(issue.issueID);
  }

  onIssuesViewToggle(): void {
    this.issuesViewToggle = !this.issuesViewToggle;
  }
}
