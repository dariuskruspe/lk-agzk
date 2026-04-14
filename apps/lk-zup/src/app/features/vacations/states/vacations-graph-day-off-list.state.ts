import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable } from 'rxjs';
import { VacationsGraphDayOffListInterface } from '../models/vacations-graph-day-off-list.interface';
import { VacationsGraphService } from '../sevices/vacations-graph.service';

@Injectable({
  providedIn: 'root',
})
export class VacationsGraphDayOffListState {
  public entityName = 'vacationsGraphDayOffListState';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.getDayOffList,
    },
  };

  constructor(private vacationsGraphService: VacationsGraphService) {}

  getDayOffList(param: {
    startDate: string;
    stopDate: string;
  }): Observable<VacationsGraphDayOffListInterface> {
    return this.vacationsGraphService.getDayOffList(param);
  }
}
