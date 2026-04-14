import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { IssueTypes } from '@features/issues/models/issues-types.interface';
import { FpcOptionListItemInterface } from '@wafpc/base/models/fpc.interface';

@Component({
    selector: 'app-issues-management-filters',
    templateUrl: './issues-management-filters.component.html',
    styleUrls: ['./issues-management-filters.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class IssuesManagementFiltersComponent {
  @Input() issuesTypes: IssueTypes[];

  @Input() types: string[];

  @Input() employeesSubordinatesList: any[];

  @Input() employee: any;

  @Input() activeTab: 'approve' | 'all';

  @Input() statusList: any[];

  @Input() status: any;

  @Input() daysValueList: FpcOptionListItemInterface[];

  @Input() period: any;

  @Output() applyFilters = new EventEmitter();
}
