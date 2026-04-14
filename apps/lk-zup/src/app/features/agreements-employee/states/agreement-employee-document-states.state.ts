import { Injectable } from '@angular/core';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AgreementsEmployeeDocumentStateInterface } from '../models/agreements-employee-document-state.interface';
import { AgreementsEmployeeDocumentStatesService } from '../services/agreements-employee-document-states.service';

@Injectable({
  providedIn: 'root',
})
export class AgreementEmployeeDocumentStatesState {
  public entityName = 'agreementEmployeeDocumentStates';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.getStates,
    },
  };

  constructor(
    private agreementsEmployeeDocumentStatesService: AgreementsEmployeeDocumentStatesService
  ) {}

  getStates(): Observable<AgreementsEmployeeDocumentStateInterface> {
    return this.agreementsEmployeeDocumentStatesService.getStates().pipe(
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
