import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { IssueTypes } from '@features/issues/models/issues-types.interface';
import {
  IssuesListFormFilterValueInterface,
  IssuesStatusInterface,
} from '@features/issues/models/issues.interface';
import { FpcOptionListItemInterface } from '@wafpc/base/models/fpc.interface';

@Component({
    selector: 'app-issues-filters',
    templateUrl: './issues-filters.component.html',
    styleUrls: ['./issues-filters.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class IssuesFiltersComponent {
  @Input() issuesTypes: IssueTypes[];

  @Input() filterValue: IssuesListFormFilterValueInterface;

  @Input() daysValueList: FpcOptionListItemInterface[];

  @Input() issuesStatusList: IssuesStatusInterface;

  @Output() applyFilters = new EventEmitter();
}
