import { NgModule } from '@angular/core';
import { OnboardingFacade } from './facades/onboarding.facade';
import { OnboardingState } from './states/onboarding.state';

@NgModule({
  providers: [OnboardingFacade, OnboardingState],
})
export class OnboardingModule {}
