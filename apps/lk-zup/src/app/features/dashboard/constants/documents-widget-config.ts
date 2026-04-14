import {
  ItemListBuilderInterface,
  ListLayoutsInterface,
} from '../../../shared/components/item-list-builder/models/item-list-builder.interface';

export const WIDGET_DOCUMENTS_ITEM_LAYOUT: ListLayoutsInterface = {
  m: '"iconName title" 1fr "iconName name" 1fr / 50px 1fr',
  l: '"iconName title name" 1fr / 50px 3fr 1fr',
};

export const WIDGET_DOCUMENTS_DATA_CONFIG: ItemListBuilderInterface[] = [
  {
    type: 'icon',
    name: 'iconName',
    class: ['align-left'],
  },
  {
    type: 'heading',
    name: 'name',
    area: 'title',
    class: ['align-left'],
  },
  {
    type: 'status',
    name: 'name',
    class: ['align-right', 'align-sm-left'],
    tooltip: true,
  },
];
