import { Injectable } from '@angular/core';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable, of } from 'rxjs';
import { AgreementsEmployeeInterface } from '../models/agreement-employee.interface';
import { AgreementsEmployeeService } from '../services/agreements-employee.service';

@Injectable({
  providedIn: 'root',
})
// Стор используется на этой же странице поэтому сделан в отдельной сущности (не объеденять!)
export class UnsignedAgreementsEmployeeState {
  public entityName = 'unsignedDocuments';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.getUnsignedAgreementsEmployeeList,
      success: this.successHasUnsignedAgreementsEmployeeList,
    },
  };

  constructor(
    private agreementsEmployeeService: AgreementsEmployeeService,
    private localstorageService: LocalStorageService,
  ) {}

  getUnsignedAgreementsEmployeeList(data: {
    currentEmployeeId: string;
    docUnsignedStates: string[];
  }): Observable<AgreementsEmployeeInterface> {
    return this.agreementsEmployeeService.getUnsignedAgreementsEmployeeList(
      data,
    );
  }

  successHasUnsignedAgreementsEmployeeList(
    res: AgreementsEmployeeInterface,
  ): Observable<void> {
    this.localstorageService.setHasUnsignedDocuments(res.documents.length);
    return of();
  }
}
