import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { VacationsInterface } from '@features/vacations/models/vacations.interface';
import { FpcInterface } from '@wafpc/base/models/fpc.interface';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'calendar-graph-filter',
    templateUrl: './calendar-graph-filter.component.html',
    styleUrls: ['./calendar-graph-filter.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class CalendarGraphFilterComponent {
  @Input() filterConfig: FpcInterface;

  @Input() loading: boolean;

  @Input() set vacations(value: VacationsInterface[]) {
    if (!this.hasInitialPatching && value) {
      this.hasInitialPatching = true;
    }
  }

  hasInitialPatching = false;

  @Output() filterSubmit = new EventEmitter();

  submitEventOut(value: Event): void {
    this.filterSubmit.emit(value);
  }
}
