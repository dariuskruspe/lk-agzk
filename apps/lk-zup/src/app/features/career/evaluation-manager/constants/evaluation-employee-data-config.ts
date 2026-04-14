import {
  ItemListBuilderInterface,
  ListLayoutsInterface,
} from '@shared/components/item-list-builder/models/item-list-builder.interface';

export const EVALUATION_EMPLOYEE_ITEM_LAYOUT: ListLayoutsInterface = {
  m: '"photo employeeName" 3fr "photo position" 2fr "photo employeeName" 30px / 50px 1fr',
  l: '"photo employeeName position division " 1fr / 50px 2fr 1fr 2fr',
};

export const EVALUATION_EMPLOYEE_DATA_CONFIG: ItemListBuilderInterface[] = [
  {
    type: 'avatar',
    name: 'photo',
    class: ['align-left'],
  },
  {
    type: 'heading',
    name: 'employeeName',
    class: ['align-left', 'bold'],
  },
  {
    type: 'text',
    class: ['align-left', 'small-text-sm', 'nowrap-sm'],
    name: 'position',
    color: '#989aa2',
  },
  {
    type: 'text',
    class: ['align-left', 'small-text-sm', 'nowrap-sm'],
    name: 'division',
    color: '#989aa2',
  },
];
