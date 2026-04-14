import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../classes/abstractions/abstract.facade';
import { DocumentLogsFileState } from '../states/document-logs-file.state';

@Injectable({
  providedIn: 'root',
})
export class DocumentLogsFileFacade extends AbstractFacade<string> {
  constructor(protected geRx: GeRx, protected store: DocumentLogsFileState) {
    super(geRx, store);
  }
}
