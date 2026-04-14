import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { EmployeeListItemInterface } from '../models/vacations.interface';
import { VacationsEmployeeListState } from '../states/vacations-employee-list.state';

@Injectable({
  providedIn: 'root',
})
export class VacationsEmployeeListFacade extends AbstractFacade<
  EmployeeListItemInterface[]
> {
  constructor(
    protected geRx: GeRx,
    protected store: VacationsEmployeeListState
  ) {
    super(geRx, store);
  }
}
