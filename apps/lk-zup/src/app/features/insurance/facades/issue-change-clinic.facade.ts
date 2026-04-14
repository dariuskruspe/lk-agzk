import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { IssuesTypesTemplateInterface } from '../../issues/models/issues-types.interface';
import { IssueChangeClinicState } from '../states/issue-change-clinic.state';

@Injectable({
  providedIn: 'root',
})
export class IssueChangeClinicFacade extends AbstractFacade<IssuesTypesTemplateInterface> {
  constructor(protected geRx: GeRx, protected store: IssueChangeClinicState) {
    super(geRx, store);
  }
}
