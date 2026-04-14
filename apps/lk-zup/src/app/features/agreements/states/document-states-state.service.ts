import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DocumentStatesInterface } from '../models/document-states.interface';
import { AgreementsDocumentStatesService } from '../services/agreements-document-states.service';

@Injectable({
  providedIn: 'root',
})
export class DocumentStatesState {
  public entityName = 'agreementDocumentStates';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.getStates,
    },
  };

  constructor(
    private agreementsDocumentStatesService: AgreementsDocumentStatesService
  ) {}

  getStates(): Observable<DocumentStatesInterface> {
    return this.agreementsDocumentStatesService.getStates().pipe(
      map((data) => {
        return {
          documentsStates: data.documentsStates.map((state) => ({
            ...state,
            color: state.color.startsWith('#')
              ? state.color
              : `var(--${state.color})`,
          })),
        };
      })
    );
  }
}
