import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AgreementsEmployeeDocumentStateInterface } from '../models/agreements-employee-document-state.interface';
import { injectResource } from '@app/shared/services/api-resource/utils';
import { DocumentStatesResource } from '@app/shared/api-resources/document-states.resource';

@Injectable({
  providedIn: 'root',
})
export class AgreementsEmployeeDocumentStatesService {
  documentStatesResource = injectResource(DocumentStatesResource);

  getStates(): Observable<AgreementsEmployeeDocumentStateInterface> {
    return this.documentStatesResource.asObservable();
  }
}
