import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { VacationEmployeeDownloadInterface } from '../models/vacations.interface';
import { VacationsEmployeeDownloadState } from '../states/vacations-employee-download.state';

@Injectable({
  providedIn: 'root',
})
export class VacationsEmployeeDownloadFacade extends AbstractFacade<VacationEmployeeDownloadInterface> {
  constructor(
    protected geRx: GeRx,
    protected store: VacationsEmployeeDownloadState
  ) {
    super(geRx, store);
  }
}
