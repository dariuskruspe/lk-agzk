import {
  ItemListBuilderInterface,
  ListLayoutsInterface,
} from '../../../shared/components/item-list-builder/models/item-list-builder.interface';

export const WIDGET_BUSINESS_TRIPS_ITEM_LAYOUT: ListLayoutsInterface = {
  s: '"iconName documentName" 3fr "iconName startDate" 2fr "iconName button" 50px / 50px 1fr',
  m: '"iconName documentName" 3fr "iconName startDate" 2fr "iconName button" 50px / 50px 1fr',
  l: '"checkbox iconName documentName startDate endDate button" 1fr / minmax(0, auto) 50px 1.5fr 1fr 1fr 1fr',
};

export const WIDGET_BUSINESS_TRIPS_DATA_CONFIG: ItemListBuilderInterface[] = [
  {
    type: 'icon',
    name: 'iconName',
    class: ['align-left'],
  },
  {
    type: 'heading',
    name: 'documentName',
    class: ['align-left', 'small-text-sm'],
  },
  {
    type: 'text',
    class: ['align-left', 'small-text-sm'],
    name: 'startDate',
    pipe: 'date',
    color: '#989aa2',
  },
  {
    type: 'text',
    class: ['align-left', 'small-text-sm'],
    name: 'endDate',
    pipe: 'date',
    color: '#989aa2',
  },
  {
    type: 'button',
    name: 'button',
    class: ['align-right', 'align-sm-left'],
  },
];
