import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { AgreementsEmployeeService } from '../services/agreements-employee.service';
@Injectable({
  providedIn: 'root',
})
export class AgreementsEmployeeTypesListState {
  public entityName = 'agreementsEmployeeTypesList';

  public geRxMethods: GeRxMethods = {
    exception: {
      main: this.agreementsEmployeeService.getDocumentTypes.bind(
        this.agreementsEmployeeService
      ),
    },
  };

  constructor(protected agreementsEmployeeService: AgreementsEmployeeService) {}
}
