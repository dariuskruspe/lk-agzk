import { Injectable } from '@angular/core';
import {
  AgreementsEmployeeDocumentStateInterface,
  AgreementsEmployeeDocumentStateItemInterface,
} from '../models/agreements-employee-document-state.interface';

@Injectable({
  providedIn: 'root',
})
export class AgreementsEmployeeStateUtils {
  getItem(
    stateList: AgreementsEmployeeDocumentStateInterface,
    stateId: string
  ): AgreementsEmployeeDocumentStateItemInterface {
    return stateList.documentsStates.find((e) => e.id === stateId);
  }

  getUnsignedList(
    stateList: AgreementsEmployeeDocumentStateInterface
  ): string[] {
    return stateList.documentsStates
      .filter((e) => {
        return e.sign === false;
      })
      .map((e) => {
        return e.id;
      });
  }
}
