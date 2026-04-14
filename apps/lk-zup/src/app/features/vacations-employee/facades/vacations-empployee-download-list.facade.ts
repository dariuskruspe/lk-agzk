import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { VacationEmployeeDownloadInterface } from '../models/vacations.interface';
import { VacationsEmployeeDownloadListState } from '../states/vacations-employee-download-list.state';

@Injectable({
  providedIn: 'root',
})
export class VacationsEmployeeDownloadListFacade extends AbstractFacade<VacationEmployeeDownloadInterface> {
  constructor(
    protected geRx: GeRx,
    protected store: VacationsEmployeeDownloadListState
  ) {
    super(geRx, store);
  }
}
