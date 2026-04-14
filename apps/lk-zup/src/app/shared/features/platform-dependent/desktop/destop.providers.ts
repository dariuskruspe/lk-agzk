import { Provider } from '@angular/core';
import { OnboardingFacade } from '../../onboarding/facades/onboarding.facade';
import { OnboardingState } from '../../onboarding/states/onboarding.state';

export const desktopProviders: Provider[] = [OnboardingFacade, OnboardingState];
