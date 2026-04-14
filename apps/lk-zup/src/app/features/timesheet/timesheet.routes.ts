import { Routes } from '@angular/router';
import { TimesheetComponent } from './timesheet.component';

export default [
  {
    path: 'my',
    component: TimesheetComponent,
    data: {
      mode: 'my_timesheet',
    },
  },
  {
    path: 'team',
    component: TimesheetComponent,
    data: {
      mode: 'team_timesheet',
    },
  },
] satisfies Routes;
