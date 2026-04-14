import {
  ItemListBuilderInterface,
  ListLayoutsInterface,
} from '../../../shared/components/item-list-builder/models/item-list-builder.interface';

export const TAX_ITEM_LAYOUT: ListLayoutsInterface = {
  m:
    // eslint-disable-next-line max-len
    '"iconName issueTypeFullName issueTypeFullName issueTypeFullName issueTypeFullName" 3fr "iconName date date taxAllowanceStartDate taxAllowanceStartDate" 2fr "iconName name name number attached" 30px / 50px 1fr 1fr 1fr 30px',
  l: '"iconName issueTypeFullName date taxAllowanceStartDate number attached name" 1fr / 50px 3fr 1.5fr 1.5fr 1fr 30px 1.5fr',
};

export const TAX_DATA_CONFIG: ItemListBuilderInterface[] = [
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
    class: ['align-sm-left', 'align-center', 'small-text-sm', 'nowrap-sm'],
    name: 'date',
    pipe: 'date',
    color: '#989aa2',
  },
  {
    type: 'text',
    prefix: 'C&nbsp;',
    class: ['align-center', 'align-sm-left', 'small-text-sm', 'nowrap-sm'],
    name: 'taxAllowanceStartDate',
    pipe: 'date',
    color: '#989aa2',
  },
  {
    type: 'text',
    class: ['align-center', 'align-sm-left', 'small-text-sm', 'nowrap-sm'],
    name: 'number',
    prefix: '#',
    color: '#989aa2',
  },
  {
    type: 'icon',
    icon: 'pi-paperclip',
    background: 'none',
    name: 'attached',
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
