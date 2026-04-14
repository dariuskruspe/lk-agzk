import { Injectable } from '@angular/core';
import { AbstractFacade } from '@shared/classes/abstractions/abstract.facade';
import { DocumentStatesInterface } from '../models/document-states.interface';
import { DocumentStatesState } from '../states/document-states-state.service';
import { GeRx } from 'gerx';

@Injectable({
  providedIn: 'root',
})
export class DocumentStateFacade extends AbstractFacade<DocumentStatesInterface> {
  constructor(protected geRx: GeRx, protected store: DocumentStatesState) {
    super(geRx, store);
  }

  getState(): void {
    this.show();
  }
}
