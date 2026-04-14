import {
  ItemListBuilderInterface,
  ListLayoutsInterface,
} from '../../../shared/components/item-list-builder/models/item-list-builder.interface';

export const AGREEMENT_ITEM_LAYOUT: ListLayoutsInterface = {
  m: '"checkbox employeeName employeeName" 1fr "iconName name name" 1fr "iconName status mandatory" 30px / 50px 1fr 1fr',
  l: '"checkbox iconName employeeName name stateDate mandatory status" 1fr / minmax(0, auto) 50px 1.5fr 1.5fr 1fr 30px 1fr',
};

export const AGREEMENT_DATA_CONFIG: ItemListBuilderInterface[] = [
  {
    type: 'icon',
    name: 'iconName',
    class: ['custom-align'],
  },
  {
    type: 'heading',
    name: 'employeeName',
    class: ['align-left'],
  },
  {
    type: 'heading',
    name: 'name',
    class: ['align-left', 'bold'],
  },
  {
    type: 'text',
    class: ['align-center', 'small-text-sm'],
    name: 'stateDate',
    pipe: 'date',
    color: '#989aa2',
  },
  {
    type: 'icon',
    icon: 'pi-star',
    background: 'none',
    showParamName: 'mandatory',
    name: 'mandatory',
    color: '#000',
    class: ['align-right'],
  },
  {
    type: 'status',
    name: 'name',
    area: 'status',
    class: ['align-right', 'align-sm-left'],
    tooltip: true,
  },
];
