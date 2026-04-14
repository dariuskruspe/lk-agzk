import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  BREADCRUMB,
  provideBreadcrumb,
} from '@features/main/utils/breadcrumb-provider.utils';
import { OnboardingInterface } from '@features/onboarding/interfaces/onboarding.interface';
import { OnboardingFacade } from '@shared/features/onboarding/facades/onboarding.facade';
import { OnboardingHelperService } from '@shared/features/onboarding/services/onboarding-helper.service';
import { PlatformResolvedGuard } from '@shared/guards/platform-resolved.guard';

@Component({
    selector: 'app-support-onboarding-container',
    templateUrl: './support-onboarding-container.component.html',
    styleUrls: ['./support-onboarding-container.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideBreadcrumb('ONBOARDINGS_COMPLETION', 1)],
    standalone: false
})
export class SupportOnboardingContainerComponent {
  public initialized = false;

  constructor(
    @Inject('ONB_SETUP')
    private onbSetup: OnboardingInterface,
    public onboardingFacade: OnboardingFacade,
    public onboardingHelper: OnboardingHelperService,
    @Inject(BREADCRUMB) private _: unknown,
    private platformResolvedGuard: PlatformResolvedGuard,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.platformResolvedGuard.isResolved().then((v) => {
      if (!v) {
        this.router.navigate(['', 'support']);
      } else {
        this.initialized = true;
        this.cdr.markForCheck();
      }
    });
  }

  // skuzminov: втихаря стащил отсюда метод "repeat" и перенёс его в OnboardingHelperService ^_^
}
