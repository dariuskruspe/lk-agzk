import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { VacationItemComputed } from '../shared/vacations.service';

@Injectable()
export class VacationsMonthViewerService {
  readonly employeeClick$ = new Subject<VacationItemComputed>();
}
