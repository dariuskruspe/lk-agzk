import {
  ItemListBuilderInterface,
  ListLayoutsInterface,
} from '../../../shared/components/item-list-builder/models/item-list-builder.interface';

export const ISSUE_MANAGMENT_ITEM_LAYOUT: ListLayoutsInterface = {
  m: '"checkbox employeeName employeeName" 3fr "iconName typeFullName typeFullName" 2fr "iconName date number" 30px "iconName name attached" 30px / 50px 1fr 1fr',
  l: '"checkbox iconName employeeName typeFullName date number attached name" 1fr / 30px 50px 1.5fr 1.5fr 1fr 1fr 30px 1fr',
};

export const ISSUE_MANAGEMENT_DATA_CONFIG: ItemListBuilderInterface[] = [
  {
    type: 'icon',
    name: 'iconName',
    class: ['align-left'],
  },
  {
    type: 'heading',
    name: 'employeeName',
    class: ['align-left'],
    tooltip: true,
  },
  {
    type: 'heading',
    name: 'typeFullName',
    class: ['align-left'],
  },
  {
    type: 'text',
    class: ['align-center', 'align-sm-left', 'nowrap-sm', 'small-text-sm'],
    name: 'date',
    pipe: 'date',
    color: '#989aa2',
  },
  {
    type: 'text',
    class: ['align-center', 'align-sm-left', 'nowrap-sm', 'small-text-sm'],
    name: 'number',
    prefix: '#',
    color: '#989aa2',
  },
  {
    type: 'icon',
    icon: 'pi-paperclip',
    background: 'none',
    showParamName: 'attachedFiles',
    name: 'attached',
    color: '#000',
    class: ['align-center', 'align-sm-right'],
  },
  {
    type: 'status',
    name: 'name',
    class: ['align-right', 'align-sm-left'],
    tooltip: true,
  },
];
