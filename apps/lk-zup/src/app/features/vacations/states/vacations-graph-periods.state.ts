import { Injectable, inject } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable, Subject } from 'rxjs';
import { filter, map, shareReplay, switchMap, take } from 'rxjs/operators';
import { EmployeeVacationsService } from '@shared/features/calendar-graph/services/employee-vacations.service';
import { StateInterface } from '../../../shared/models/state.interface';
import { VacationsInterface } from '../models/vacations.interface';
import { VacationsGraphService } from '../sevices/vacations-graph.service';

@Injectable({
  providedIn: 'root',
})
export class VacationsGraphPeriodsState implements StateInterface {
  public entityName = 'vacationsGraphPeriodsState';

  private employeeVacationsService = inject(EmployeeVacationsService);

  private yearRequestSubject = new Subject<{
    year: number;
    requestId: number;
  }>();

  private requestCounter = 0;

  private vacations$: Observable<{
    data: VacationsInterface[];
    requestId: number;
  }> = this.yearRequestSubject.pipe(
    switchMap(({ year, requestId }) =>
      this.vacationsGraphService
        .getVacationPeriods({ year })
        .pipe(map((data) => ({ data, requestId }))),
    ),
    shareReplay({ bufferSize: 1, refCount: false }),
  );

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.getVacationPeriods,
    },
  };

  constructor(private vacationsGraphService: VacationsGraphService) {
    this.vacations$.subscribe();
  }

  getVacationPeriods(params: {
    year: number;
  }): Observable<VacationsInterface[]> {
    this.employeeVacationsService.vacationsManagementToBeApprovedCountSignal.set(
      null,
    );
    const requestId = ++this.requestCounter;
    this.yearRequestSubject.next({ year: params.year, requestId });

    return this.vacations$.pipe(
      filter((result) => result.requestId === requestId),
      take(1),
      map((result) => result.data),
    );
  }
}
