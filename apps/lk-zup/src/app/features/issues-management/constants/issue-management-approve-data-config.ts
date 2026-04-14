import { ItemListBuilderInterface } from '../../../shared/components/item-list-builder/models/item-list-builder.interface';

export const ISSUE_MANAGEMENT_APPROVE_DATA_CONFIG: ItemListBuilderInterface[] =
  [
    {
      type: 'checkbox',
      name: 'checkbox',
      class: ['align-left'],
    },
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
