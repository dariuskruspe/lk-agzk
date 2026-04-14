import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../classes/abstractions/abstract.facade';
import { ValidationFileState } from '../states/validation-file.state';

@Injectable({
  providedIn: 'root',
})
export class ValidationFileFacade extends AbstractFacade<Blob> {
  constructor(protected geRx: GeRx, protected store: ValidationFileState) {
    super(geRx, store);
  }
}
