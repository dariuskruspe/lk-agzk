import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable } from 'rxjs';
import {
  TaxListFormFilter,
  TaxListInterface,
} from '../models/salaries-tax.interface';
import { SalariesDashboardTaxService } from '../services/salaries-dashboard-tax.service';

@Injectable({
  providedIn: 'root',
})
export class SalariesDashboardTaxState {
  public entityName = 'taxDashboard';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.getIncomeTax,
    },
  };

  constructor(private dashboardTaxService: SalariesDashboardTaxService) {}

  getIncomeTax(filterData?: TaxListFormFilter): Observable<TaxListInterface> {
    return this.dashboardTaxService.getIncomeTax(filterData);
  }
}
