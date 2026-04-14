import {
  ItemListBuilderInterface,
  ListLayoutsInterface,
} from '../../../shared/components/item-list-builder/models/item-list-builder.interface';

export const INSURANCE_ITEM_LAYOUT: ListLayoutsInterface = {
  m: '"iconName issueTypeFullName issueTypeFullName issueTypeFullName" 3fr "iconName date number number" 2fr "iconName name name attached" 30px / 50px 2fr 1fr 30px',
  l: '"iconName issueTypeFullName date number attached name" 1fr / 50px 3fr 1.5fr 1fr 30px 1fr',
};

export const ISSUE_INSURANCE_DATA_CONFIG: ItemListBuilderInterface[] = [
  {
    type: 'icon',
    name: 'iconName',
    class: ['align-left'],
  },
  {
    type: 'heading',
    name: 'issueTypeFullName',
    class: ['align-left', 'bold'],
  },
  {
    type: 'text',
    name: 'date',
    pipe: 'date',
    color: '#989aa2',
    class: ['align-sm-left', 'align-center', 'small-text-sm', 'nowrap-sm'],
  },
  {
    type: 'text',
    name: 'number',
    prefix: '#',
    color: '#989aa2',
    class: ['align-center', 'align-sm-right', 'small-text-sm', 'nowrap-sm'],
  },
  {
    type: 'icon',
    name: 'attached',
    icon: 'pi-paperclip',
    background: 'none',
    showParamName: 'attachedFiles',
    color: '#000',
    class: ['align-right'],
  },
  {
    type: 'status',
    name: 'name',
    class: ['align-sm-left', 'align-right'],
    tooltip: true,
  },
];
