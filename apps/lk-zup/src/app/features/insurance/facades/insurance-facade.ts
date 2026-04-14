import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { Insurance } from '../models/insurance.interface';
import { InsuranceState } from '../states/insurance-state';

@Injectable({
  providedIn: 'root',
})
export class InsuranceFacade extends AbstractFacade<Insurance> {
  constructor(protected geRx: GeRx, protected store: InsuranceState) {
    super(geRx, store);
  }

  getInsurance(employeeId: string): void {
    this.show(employeeId);
  }
}
