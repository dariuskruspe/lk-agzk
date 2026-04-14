import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../classes/abstractions/abstract.facade';
import { MessagesLangState } from '../states/massages-lang.state';

@Injectable({
  providedIn: 'root',
})
export class MessagesLangFacade extends AbstractFacade<{ language: string }> {
  constructor(protected geRx: GeRx, protected store: MessagesLangState) {
    super(geRx, store);
  }
}
