import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { InsuranceService } from '../services/insurance.service';

@Injectable({
  providedIn: 'root',
})
export class InsuranceIssueTypeState {
  public entityName = 'insuranceIssueType';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.insuranceService.getInsuranceIssueTypes.bind(
        this.insuranceService
      ),
    },
  };

  constructor(private insuranceService: InsuranceService) {}
}
