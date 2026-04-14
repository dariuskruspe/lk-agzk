import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable } from 'rxjs';
import { VacationsGraphService } from '../sevices/vacations-graph.service';

@Injectable({
  providedIn: 'root',
})
export class VacationsGraphStatusTypesState {
  public entityName = 'vacationsGraphStatusTypes';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.getStatusTypes,
    },
  };

  constructor(private vacationsGraphService: VacationsGraphService) {}

  getStatusTypes(): Observable<unknown[]> {
    return this.vacationsGraphService.getStatusTypes();
  }
}
