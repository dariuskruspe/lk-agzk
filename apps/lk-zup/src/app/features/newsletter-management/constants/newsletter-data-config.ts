import {
  ItemListBuilderInterface,
  ListLayoutsInterface,
} from '../../../shared/components/item-list-builder/models/item-list-builder.interface';

export const NEWSLETTER_ITEM_LAYOUT: ListLayoutsInterface = {
  m: '"icon newsletterName" 3fr "icon newsletterName" 2fr "icon newsletterName" 30px / 50px 1fr',
  l: '"icon newsletterName startDate authorName status" 1fr / 50px 2fr 1fr 1fr',
};

export const NEWSLETTER_DATA_CONFIG: ItemListBuilderInterface[] = [
  {
    type: 'icon',
    name: 'icon',
    class: ['align-left'],
  },
  {
    type: 'heading',
    name: 'newsletterName',
    class: ['align-left', 'bold'],
  },
  {
    type: 'text',
    name: 'startDate',
    class: ['align-left', 'small-text-sm', 'nowrap-sm'],
    color: '#989aa2',
    pipe: 'date',
  },
  {
    type: 'text',
    name: 'authorName',
    class: ['align-left', 'small-text-sm', 'nowrap-sm'],
    color: '#666666',
  },
  {
    type: 'status',
    name: 'status',
    area: 'status',
    class: ['align-right', 'align-sm-center'],
    tooltip: true,
  },
];
