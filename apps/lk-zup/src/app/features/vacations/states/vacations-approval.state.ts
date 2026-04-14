import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable, of } from 'rxjs';
import { StateInterface } from '../../../shared/models/state.interface';
import {
  VacationActionEnum,
  VacationsApprovalInterface,
} from '../models/vacations-approval.interface';
import { VacationsGraphService } from '../sevices/vacations-graph.service';

@Injectable({
  providedIn: 'root',
})
export class VacationsApprovalState implements StateInterface {
  public entityName = 'vacationsApprovalState';

  private vacationsEntityName = 'vacationsGraphPeriodsState';

  public geRxMethods: GeRxMethods = {
    edit: {
      main: this.approveOrDiscardVacations,
      success: this.getVacationsOnCurrentYear,
    },
  };

  private bufferedYear: number;

  constructor(
    private vacationsGraphService: VacationsGraphService,
    private geRx: GeRx
  ) {}

  approveOrDiscardVacations(args: {
    param: {
      year: number;
    };
    action: VacationActionEnum;
    employees: VacationsApprovalInterface[];
  }): Observable<void> {
    this.bufferedYear = args.param.year;
    return this.vacationsGraphService.approveOrDiscardVacations(
      args.action,
      args.param,
      args.employees
    );
  }

  getVacationsOnCurrentYear(): Observable<unknown> {
    const year = this.bufferedYear;
    window.location.reload();
    return of(this.geRx.show(this.vacationsEntityName, { year }));
  }
}
