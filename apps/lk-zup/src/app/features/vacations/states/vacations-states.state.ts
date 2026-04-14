import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { StateInterface } from '../../../shared/models/state.interface';
import { VacationsGraphService } from '../sevices/vacations-graph.service';

@Injectable({
  providedIn: 'root',
})
export class VacationsStatesState implements StateInterface {
  public entityName = 'vacationsStatesState';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.vacationsGraphService.getVacationStates.bind(
        this.vacationsGraphService
      ),
    },
  };

  constructor(private vacationsGraphService: VacationsGraphService) {}
}
