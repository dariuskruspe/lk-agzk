import {
  ItemListBuilderInterface,
  ListLayoutsInterface,
} from '../../../shared/components/item-list-builder/models/item-list-builder.interface';

export const FEEDBACK_ITEM_LAYOUT: ListLayoutsInterface = {
  s: '"iconName name" 2fr "iconName stateDate" 1fr "iconName status" 30px / 50px 1fr',
  m: '"employeeName employeeName" 1fr "iconName name name" 1fr "iconName status" 30px / 50px 1fr 1fr',
  l: '"iconName employeeName name stateDate status" 1fr / minmax(0, auto) 260px 1.5fr 1.5fr',
};

export const FEEDBACK_DATA_CONFIG: ItemListBuilderInterface[] = [
  {
    type: 'icon',
    name: 'iconName',
    class: ['custom-align'],
  },
  {
    type: 'heading',
    name: 'employeeName',
    class: ['align-left', 'align-sm-center'],
  },
  {
    type: 'heading',
    name: 'name',
    class: ['align-left', 'bold', 'align-sm-center'],
  },
  {
    type: 'text',
    class: ['align-center', 'small-text-sm', 'align-sm-center'],
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
