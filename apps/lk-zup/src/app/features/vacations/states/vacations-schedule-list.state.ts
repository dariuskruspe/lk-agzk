import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { VacationsGraphService } from '../sevices/vacations-graph.service';

@Injectable({
  providedIn: 'root',
})
export class VacationsScheduleListState {
  public entityName = 'vacationsScheduleListState';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.vacationsGraphService.getScheduleList.bind(
        this.vacationsGraphService
      ),
    },
  };

  constructor(private vacationsGraphService: VacationsGraphService) {}
}
