import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { InsuranceService } from '../services/insurance.service';

@Injectable({
  providedIn: 'root',
})
export class InsuranceState {
  public entityName = 'insurance';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.insuranceService.getInsurance.bind(this.insuranceService),
    },
  };

  constructor(private insuranceService: InsuranceService) {}
}
