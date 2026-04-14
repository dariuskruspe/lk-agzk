import {
  ItemListBuilderInterface,
  ListLayoutsInterface,
} from '../../../shared/components/item-list-builder/models/item-list-builder.interface';

export const WIDGET_ISSUE_ITEM_LAYOUT: ListLayoutsInterface = {
  m: '"iconName typeFullName" 1fr "iconName name" 1fr / 50px 1fr',
  l: '"iconName typeFullName name" 1fr / 50px 3fr 1fr',
};

export const WIDGET_ISSUE_DATA_CONFIG: ItemListBuilderInterface[] = [
  {
    type: 'icon',
    name: 'iconName',
    class: ['align-left'],
  },
  {
    type: 'heading',
    name: 'typeFullName',
    class: ['align-left'],
  },
  {
    type: 'status',
    name: 'name',
    tooltip: true,
    class: ['align-right', 'align-sm-left'],
  },
];
