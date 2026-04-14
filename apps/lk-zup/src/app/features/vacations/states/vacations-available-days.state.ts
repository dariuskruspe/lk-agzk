import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable } from 'rxjs';
import { StateInterface } from '../../../shared/models/state.interface';
import { AvailableDaysReponseInterface } from '../models/vacations.interface';
import { VacationsGraphService } from '../sevices/vacations-graph.service';

@Injectable({
  providedIn: 'root',
})
export class VacationsAvailableDaysState implements StateInterface {
  public entityName = 'vacationsAvailableDaysState';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.getAvailableVacationDays,
    },
  };

  constructor(private vacationsGraphService: VacationsGraphService) {}

  getAvailableVacationDays(param: {
    year: number;
  }): Observable<AvailableDaysReponseInterface> {
    return this.vacationsGraphService.getAvailableVacationDays(param);
  }
}
