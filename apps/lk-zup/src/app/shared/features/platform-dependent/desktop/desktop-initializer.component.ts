import { Component } from '@angular/core';
import { OnboardingFacade } from '../../onboarding/facades/onboarding.facade';

@Component({
    template: '',
    standalone: false
})
export class DesktopInitializerComponent {
  constructor(private onbFacade: OnboardingFacade) {
    this.onbFacade.show();
  }
}
