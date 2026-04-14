import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CalendarGraphHoverService } from '../shared/calendar-graph-hover.service';

@Component({
  selector: 'app-calendar-graph',
  imports: [],
  templateUrl: './calendar-graph.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CalendarGraphHoverService],
})
export class CalendarGraph {}
