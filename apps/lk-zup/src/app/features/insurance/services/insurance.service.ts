import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Environment } from '../../../shared/classes/ennvironment/environment';
import { QueryBuilder } from '../../../shared/classes/query-builder/query-builder';
import { FilterParamsInterface } from '../../../shared/models/filter-params.interface';
import { InsuranceIssueTypes } from '../models/insurance-issue-types.interface';
import { InsuranceIssues } from '../models/insurance-issues.interface';
import {
  Insurance,
  InsuranceCalculatorResponse,
  InsuranceFile,
} from '../models/insurance.interface';

@Injectable({
  providedIn: 'root',
})
export class InsuranceService {
  constructor(private http: HttpClient) {}

  getInsurance(employeeId: string): Observable<Insurance> {
    return this.http.get<Insurance>(
      `${Environment.inv().api}/wa_employee/${employeeId}/insurance`
    );
  }

  getInsuranceIssues(
    filterData: FilterParamsInterface
  ): Observable<InsuranceIssues> {
    return this.http.get<InsuranceIssues>(
      `${Environment.inv().api}/issues/insurance`,
      {
        params: QueryBuilder.queryBuilder(filterData),
      }
    );
  }

  getInsuranceIssueTypes(): Observable<InsuranceIssueTypes> {
    return this.http.get<InsuranceIssueTypes>(
      `${Environment.inv().api}/wa_issueTypes?groupAlias=insurance`
    );
  }

  getInsuranceFile(filePath: string): Observable<InsuranceFile> {
    return this.http.get<InsuranceFile>(
      `${Environment.inv().api}/${filePath}/base64`
    );
  }

  getOptionList(
    type: string,
    id?: string
  ): Observable<{ optionList: { representation: string; value: string }[] }> {
    return this.http.get<{
      optionList: { representation: string; value: string }[];
    }>(`${Environment.inv().api}/wa_issueTypes/optionList/${type}`, {
      params: id ? { id } : {},
    });
  }

  getInsuranceCalculate(
    insuranceId: string,
    cityId: string,
    gradeId: string,
    date: string
  ): Observable<InsuranceCalculatorResponse> {
    return this.http.get<InsuranceCalculatorResponse>(
      `${Environment.inv().api}/insurance/calculate`,
      {
        params: { insuranceId, gradeId, cityId, date },
      }
    );
  }
}
