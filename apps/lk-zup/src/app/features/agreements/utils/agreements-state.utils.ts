import { Injectable } from '@angular/core';
import {
  DocumentStatesInterface,
  DocumentStateInterface,
} from '../models/document-states.interface';

@Injectable({
  providedIn: 'root',
})
export class AgreementsStateUtils {
  getItem(
    stateList: DocumentStatesInterface,
    stateId: string
  ): DocumentStateInterface {
    return stateList.documentsStates.find((e) => e.id === stateId);
  }

  getUnsignedList(stateList: DocumentStatesInterface): string[] {
    return stateList.documentsStates
      .filter((e) => {
        return e.sign === false;
      })
      .map((e) => {
        return e.id;
      });
  }
}
