import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { VacationTypeInterface } from '../models/vacations-types.interface';
import { VacationsTypesState } from '../states/vacations-types.state';

@Injectable({
  providedIn: 'root',
})
export class VacationsTypesFacade extends AbstractFacade<
  VacationTypeInterface[]
> {
  constructor(protected geRx: GeRx, protected store: VacationsTypesState) {
    super(geRx, store);
  }
}
