import {
  ItemListBuilderInterface,
  ListLayoutsInterface,
} from '../../../shared/components/item-list-builder/models/item-list-builder.interface';

export const BUSINESS_TRIP_ITEM_LAYOUT: ListLayoutsInterface = {
  m:
    // eslint-disable-next-line max-len
    '"iconName issueTypeFullName issueTypeFullName issueTypeFullName issueTypeFullName" 3fr "iconName dateStart dateStart dateEnd dateEnd" 2fr "iconName name name number attached" 30px / 50px 1fr 1fr 1fr 1fr',
  l: '"iconName issueTypeFullName dateStart dateEnd number attached name" 1fr / 50px 1fr 1fr 1fr 1fr 30px 1fr',
};

export const BUSINESS_TRIP_DATA_CONFIG: ItemListBuilderInterface[] = [
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
    class: ['align-center', 'align-sm-left', 'nowrap-sm', 'small-text-sm'],
    prefix: 'C&nbsp;',
    name: 'dateStart',
    color: '#989aa2',
  },
  {
    type: 'text',
    class: ['align-center', 'align-sm-left', 'nowrap-sm', 'small-text-sm'],
    prefix: 'по&nbsp;',
    name: 'dateEnd',
    color: '#989aa2',
  },
  {
    type: 'text',
    class: ['align-center', 'align-sm-left', 'nowrap-sm', 'small-text-sm'],
    name: 'number',
    prefix: '#',
    color: '#989aa2',
  },
  // {
  //   type: 'icon',
  //   icon: 'pi-paperclip',
  //   background: 'none',
  //   showParamName: 'attachedFiles',
  //   color: '#000',
  //   class: ['align-right', 'overflow-inherit'],
  // },
  {
    type: 'link',
    class: ['align-center'],
    name: 'linkedIssue',
    color: '#989aa2',
  },
  {
    type: 'status',
    name: 'name',
    class: ['align-right', 'align-sm-left'],
    tooltip: true,
  },
];
export interface BusinessTripsTimesheetListItem {
  employeeId: string;
  name: string;
  position: string;
  periods: {
    startDate: string;
    endDate: string;
    typeId: string;
    issueId: string;
    documentId: string;
    daysLength: string;
    status: 'availible' | 'onApproval' | 'cancelled';
    linkedIssueId: string;
    linkedIssueTypeId: string;
    cancelAccess: boolean;
  }[];
}

export interface BusinessTripsMemberListItem {
  id: string;
  fullName: string;
  position: string;
  department: string;
  subordinate: boolean;
  approvingAllowed: boolean;
}
