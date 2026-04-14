import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { AvailableDaysReponseInterface } from '../models/vacations.interface';
import { VacationsAvailableDaysState } from '../states/vacations-available-days.state';

@Injectable({
  providedIn: 'root',
})
export class VacationsAvailableDaysFacade extends AbstractFacade<AvailableDaysReponseInterface> {
  constructor(
    protected geRx: GeRx,
    protected store: VacationsAvailableDaysState
  ) {
    super(geRx, store);
  }
}
