import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  ItemListBuilderInterface,
  ListLayoutsInterface,
} from '@shared/components/item-list-builder/models/item-list-builder.interface';
import {
  FpcInputsInterface,
  FpcInterface,
} from '@wafpc/base/models/fpc.interface';
import {
  IssuesStatusInterface,
  IssuesStatusListInterface,
} from '../../../issues/models/issues.interface';
import {
  TAX_DATA_CONFIG,
  TAX_ITEM_LAYOUT,
} from '../../constants/tax-data-config';
import { TaxListInterface } from '../../models/salaries-tax.interface';
import { SalariesTaxListItemComponent } from '../salaries-tax-list-item/salaries-tax-list-item.component';

@Component({
    selector: 'app-salaries-tax-list',
    templateUrl: './salaries-tax-list.component.html',
    styleUrls: ['./salaries-tax-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class SalariesTaxListComponent implements OnChanges {
  loadableListItemComponent = SalariesTaxListItemComponent;

  dataConfig: ItemListBuilderInterface[] = TAX_DATA_CONFIG;

  dataLayout: ListLayoutsInterface = TAX_ITEM_LAYOUT;

  filterInputs: FpcInputsInterface[] = [
    {
      type: 'text',
      formControlName: 'search',
      label: 'Поиск по вычетам',
      placeholder: '',
      gridClasses: ['col-lg-8', 'com-md-12'],
      validations: [],
      icon: { name: 'clear', clearMode: true },
      edited: true,
    },
    {
      type: 'select',
      formControlName: 'state',
      label: 'Статус',
      gridClasses: ['col-lg-4', 'com-md-12'],
      validations: [],
      edited: true,
      selectMultiple: true,
      optionList: [],
    },
  ];

  filterConfig: FpcInterface = {
    options: {
      changeStrategy: 'push',
      appearanceElements: 'outline',
      editMode: true,
      viewMode: 'edit',
      submitDebounceTime: 1000,
    },
    template: this.filterInputs,
  };

  scrollContainerClassCss = '.scroll-main-container';

  @Input() taxList: TaxListInterface;

  @Input() taxStateList: IssuesStatusInterface;

  @Input() loading: boolean;

  @Input() scrollPosition: number;

  @Output() saveScrollPosition = new EventEmitter();

  @Output() loadList = new EventEmitter();

  @Output() goDetails = new EventEmitter();

  @Output() backPage = new EventEmitter();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.taxStateList?.currentValue) {
      let stateInput = this.filterConfig.template.find(
        (e: FpcInputsInterface) => e.formControlName === 'state'
      );
      const taxStateList = this.taxStateList?.states.map(
        (e: IssuesStatusListInterface) => {
          return { title: e.name, value: e.id };
        }
      );
      stateInput = Object.assign(stateInput, {
        optionList: taxStateList,
      });

      this.filterInputs = Object.assign(this.filterInputs, stateInput);
    }
  }

  onGoDetails(issue: { issueID: string }): void {
    this.goDetails.emit(issue.issueID);
  }

  onLoadList(params: IssuesStatusListInterface): void {
    const modParams = params;
    modParams.searchTarget = ['issueType', 'state'];
    this.loadList.emit(modParams);
  }

  onBackPage(): void {
    this.backPage.emit();
  }
}
