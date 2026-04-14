import {
  ItemListBuilderInterface,
  ListLayoutsInterface,
} from '../../../shared/components/item-list-builder/models/item-list-builder.interface';

export const EMPLOYEE_ITEM_LAYOUT: ListLayoutsInterface = {
  m: '"photo fullName" 3fr "photo position" 2fr "photo name" 30px / 50px 1fr',
  l: '"photo fullName position name" 1fr / 50px 2fr 1fr 1fr',
};

export const EMPLOYEES_DATA_CONFIG: ItemListBuilderInterface[] = [
  {
    type: 'avatar',
    name: 'photo',
    class: ['align-left'],
  },
  {
    type: 'heading',
    name: 'fullName',
    class: ['align-left', 'bold'],
  },
  {
    type: 'text',
    class: ['align-left', 'small-text-sm', 'nowrap-sm'],
    name: 'position',
    color: '#989aa2',
  },
  {
    type: 'status',
    name: 'name',
    class: ['align-right', 'align-sm-left', 'small-text-sm', 'nowrap-sm'],
    tooltip: true,
  },
];
