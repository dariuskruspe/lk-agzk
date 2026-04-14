import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Environment } from '../../../shared/classes/ennvironment/environment';
import { QueryBuilder } from '../../../shared/classes/query-builder/query-builder';
import {
  TaxListFormFilter,
  TaxListInterface,
} from '../models/salaries-tax.interface';

@Injectable({
  providedIn: 'root',
})
export class SalariesDashboardTaxService {
  constructor(private http: HttpClient) {}

  getIncomeTax(filterData?: TaxListFormFilter): Observable<TaxListInterface> {
    return this.http.get<TaxListInterface>(
      `${Environment.inv().api}/taxAllowance`,
      {
        params: QueryBuilder.queryBuilder(filterData),
      }
    );
  }
}
