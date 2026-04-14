import { Injectable } from '@angular/core';
import { GeRx } from 'gerx';
import { AbstractFacade } from '../../../classes/abstractions/abstract.facade';
import { OnboardingState } from '../states/onboarding.state';

@Injectable()
export class OnboardingFacade extends AbstractFacade<boolean> {
  constructor(protected geRx: GeRx, protected store: OnboardingState) {
    super(geRx, store);
  }
}
