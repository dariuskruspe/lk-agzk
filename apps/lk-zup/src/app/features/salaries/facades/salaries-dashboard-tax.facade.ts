import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import {
  TaxListFormFilter,
  TaxListInterface,
} from '../models/salaries-tax.interface';
import { SalariesDashboardTaxState } from '../states/salaries-dashboard-tax.state';

@Injectable({
  providedIn: 'root',
})
export class SalariesDashboardTaxFacade extends AbstractFacade<TaxListInterface> {
  constructor(
    protected geRx: GeRx,
    protected store: SalariesDashboardTaxState
  ) {
    super(geRx, store);
  }

  getIncomeTax(filterData?: TaxListFormFilter): void {
    this.geRx.show(this.store.entityName, filterData);
  }
}
