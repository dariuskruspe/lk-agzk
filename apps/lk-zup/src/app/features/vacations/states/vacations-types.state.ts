import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StateInterface } from '../../../shared/models/state.interface';
import { VacationTypeInterface } from '../models/vacations-types.interface';
import { VacationsGraphService } from '../sevices/vacations-graph.service';

@Injectable({
  providedIn: 'root',
})
export class VacationsTypesState implements StateInterface {
  public entityName = 'vacationsTypesState';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.getVacationsTypes,
    },
  };

  constructor(private vacationsGraphService: VacationsGraphService) {}

  getVacationsTypes(): Observable<VacationTypeInterface[]> {
    return this.vacationsGraphService
      .getVacationTypes()
      .pipe(map((types) => types.vacationTypes));
  }
}
