import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { EmployeeInterface } from '../models/vacations.interface';
import { VacationsEmployeeMembersState } from '../states/vacations-employee-members.state';

@Injectable({
  providedIn: 'root',
})
export class VacationsEmployeeMembersFacade extends AbstractFacade<
  EmployeeInterface[]
> {
  constructor(
    protected geRx: GeRx,
    protected store: VacationsEmployeeMembersState
  ) {
    super(geRx, store);
  }
}
