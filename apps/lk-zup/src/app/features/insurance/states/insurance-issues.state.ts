import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { InsuranceService } from '../services/insurance.service';

@Injectable({
  providedIn: 'root',
})
export class InsuranceIssueState {
  public entityName = 'insuranceIssues';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.insuranceService.getInsuranceIssues.bind(
        this.insuranceService
      ),
    },
  };

  constructor(private insuranceService: InsuranceService) {}
}
