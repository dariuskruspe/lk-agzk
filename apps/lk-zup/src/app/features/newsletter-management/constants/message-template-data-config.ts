import {
  ItemListBuilderInterface,
  ListLayoutsInterface,
} from '../../../shared/components/item-list-builder/models/item-list-builder.interface';

export const MESSAGE_TEMPLATE_ITEM_LAYOUT: ListLayoutsInterface = {
  m: '"icon templateName" 3fr "icon templateName" 2fr "icon templateName" 30px / 50px 1fr',
  l: '"icon templateName" 1fr / 50px 1fr',
};

export const MESSAGE_TEMPLATE_DATA_CONFIG: ItemListBuilderInterface[] = [
  {
    type: 'icon',
    name: 'icon',
    class: ['align-left'],
  },
  {
    type: 'heading',
    name: 'templateName',
    class: ['align-left', 'bold'],
  },
];
