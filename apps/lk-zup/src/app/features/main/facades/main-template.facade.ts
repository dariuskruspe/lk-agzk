import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../shared/classes/abstractions/abstract.facade';
import { MainTemplateState } from '../states/main-template.state';

@Injectable({
  providedIn: 'root',
})
export class MainTemplateFacade extends AbstractFacade<unknown> {
  constructor(protected geRx: GeRx, protected store: MainTemplateState) {
    super(geRx, store);
  }

  logoutUser(id: string): void {
    this.add(id);
  }

  logoutUserSso(id: string): void {
    this.exception(id);
  }
}
