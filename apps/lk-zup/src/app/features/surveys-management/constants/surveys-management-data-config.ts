import {
  ItemListBuilderInterface,
  ListLayoutsInterface,
} from '@shared/components/item-list-builder/models/item-list-builder.interface';

export const SURVEYS_MANAGEMENT_ITEM_LAYOUT: ListLayoutsInterface = {
  s: '"iconName name" 2fr "iconName stateDate" 1fr "iconName status" 30px / 50px 1fr',
  m: '"checkbox employeeName employeeName" 1fr "iconName name name" 1fr "iconName status" 30px / 50px 1fr 1fr',
  l: '"checkbox iconName name employeeName stateDate status" 1fr / minmax(0, auto) 50px 1.5fr 1.5fr 1fr 1fr',
};

export const SURVEYS_MANAGEMENT_DATA_CONFIG: ItemListBuilderInterface[] = [
  {
    type: 'icon',
    name: 'iconName',
    class: ['align-left'],
  },
  {
    type: 'heading',
    name: 'name',
    class: ['align-left', 'bold', 'align-sm-center'],
  },
  {
    type: 'heading',
    name: 'employeeName',
    class: ['align-left', 'align-sm-center'],
  },
  {
    type: 'text',
    class: ['align-center', 'small-text-sm'],
    name: 'stateDate',
    pipe: 'date',
    color: '#989aa2',
  },
  {
    type: 'status',
    name: 'name',
    area: 'status',
    class: ['align-right', 'align-sm-center'],
    tooltip: true,
  },
];
