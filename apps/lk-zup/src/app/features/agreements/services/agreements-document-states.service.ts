import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Environment } from '../../../shared/classes/ennvironment/environment';
import { DocumentStatesInterface } from '../models/document-states.interface';
import { injectResource } from '@app/shared/services/api-resource/utils';
import { DocumentStatesResource } from '@app/shared/api-resources/document-states.resource';

@Injectable({
  providedIn: 'root',
})
export class AgreementsDocumentStatesService {
  documentStatesResource = injectResource(DocumentStatesResource);

  getStates(): Observable<DocumentStatesInterface> {
    return this.documentStatesResource.asObservable();
  }
}
