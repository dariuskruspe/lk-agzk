import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable, of } from 'rxjs';
import { StateInterface } from '../../../shared/models/state.interface';
import { VacationPeriodInterface } from '../models/vacations.interface';
import { VacationsGraphService } from '../sevices/vacations-graph.service';

@Injectable({
  providedIn: 'root',
})
export class VacationsGraphEditPeriodsState implements StateInterface {
  public entityName = 'vacationsGraphEditPeriodsState';

  private periodsEntityName = 'vacationsGraphPeriodsState';

  private vacationsAvailableDaysEntityName = 'vacationsAvailableDaysState';

  public geRxMethods: GeRxMethods = {
    edit: {
      main: this.savePeriods,
      success: this.getVacationsOnCurrentYear,
    },
  };

  private bufferedYear: number;

  constructor(
    private vacationsGraphService: VacationsGraphService,
    private geRx: GeRx
  ) {}

  savePeriods(args: {
    params: {
      year: number;
    };
    periods: VacationPeriodInterface[];
  }): Observable<void> {
    this.bufferedYear = args.params.year;
    return this.vacationsGraphService.savePeriods(args.periods, args.params);
  }

  getVacationsOnCurrentYear(): Observable<unknown> {
    const year = this.bufferedYear;
    this.geRx.show(this.vacationsAvailableDaysEntityName, { year });
    return of(this.geRx.show(this.periodsEntityName, { year }));
  }
}
