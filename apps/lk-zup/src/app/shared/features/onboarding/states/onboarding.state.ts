import { Inject, Injectable } from '@angular/core';
import { UnsignedAgreementsFacade } from '@features/agreements/facades/unsigned-agreements.facade';
import { MainMenuVisibilityService } from '@features/main/services/main-menu-visibility.service';
import {
  ClosedOnboardingInterface,
  OnboardingInterface,
} from '@features/onboarding/interfaces/onboarding.interface';
import { OnboardingService } from '@features/onboarding/services/onboarding.service';
import { LocalStorageService } from '@shared/services/local-storage.service';
import { ModalQueueService } from '@shared/services/modal-queue.service';
import { WindowsWidthService } from '@shared/services/windows-width.service';
import { GeRx } from 'gerx';
import { GeRxMethods } from 'gerx/index.interface';
import { Observable, of, switchMap } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { SettingsFacade } from '../../settings/facades/settings.facade';
import { OnboardingApiService } from '../services/onboarding-api.service';

@Injectable()
export class OnboardingState {
  public entityName = 'onbState';

  public geRxMethods: GeRxMethods = {
    show: {
      main: this.onboardingService.getSetup.bind(this.onboardingService),
      success: this.initOnboarding,
    },
    edit: {
      main: this.onboardingService.overwriteSetup.bind(this.onboardingService),
    },
  };

  private onbSetup: OnboardingInterface;

  constructor(
    @Inject('ONB_SETUP')
    private onbSetupSource: OnboardingInterface,
    private onboardingService: OnboardingApiService,
    private onboarding: OnboardingService,
    private geRx: GeRx,
    private settings: SettingsFacade,
    private unsignedAgreementsFacade: UnsignedAgreementsFacade,
    private localstorageService: LocalStorageService,
    private modalQueueService: ModalQueueService,
    private mainMenuVisibilityService: MainMenuVisibilityService,
    private windowWidth: WindowsWidthService
  ) {
    this.onbSetup = this.onbSetupSource;
  }

  initOnboarding(value: ClosedOnboardingInterface): Observable<void> {
    const sub = this.unsignedAgreementsFacade
      .getData$()
      .pipe(
        filter((data) => data?.count === 0),
        take(1),
        switchMap(() => this.mainMenuVisibilityService.menuItems$),
        take(1)
      )
      .subscribe(() => {
        if (!this.windowWidth.isMobile()) {
          this.onbSetup = {
            settings: this.onbSetup.settings,
            items: this.onbSetup.items.filter(
              (item) =>
                !item.owner ||
                (item.owner &&
                  this.mainMenuVisibilityService.hasItemByLabel(item.owner))
            ),
          };
          this.startOnboarding(value);
        }
        sub.unsubscribe();
      });
    return of();
  }

  private startOnboarding(value: ClosedOnboardingInterface): void {
    let isSkipped = value?.isSkipped;
    let isFinished = value?.isFinished;
    if (this.settings.getData().general?.demoMode) {
      isSkipped = this.localstorageService.isOnboardingSkipped(
        this.onbSetup.settings.name
      );
      isFinished = this.localstorageService.isOnboardingFinished(
        this.onbSetup.settings.name
      );
    }

    if (
      !isFinished &&
      !isSkipped &&
      this.settings.getData().general?.onboardingEnabled
    ) {
      this.modalQueueService.showWhenFree('onboarding', (done) => {
        this.showOnboarding(done);
      });
    }
  }

  private showOnboarding(onClose: () => void): void {
    const stepIndex = this.localstorageService.getOnboardingStep(
      this.onbSetup.settings.name
    );

    this.onboarding.init(this.onbSetup, stepIndex);
    this.onboarding.setChangingStepListener((step) => {
      this.localstorageService.setOnboardingStep(
        step,
        this.onbSetup.settings.name
      );
    });
    this.onboarding.setCloseListener((data) => {
      onClose();

      if (data.isFinished) {
        this.localstorageService.clearOnboardingStep(
          this.onbSetup.settings.name
        );
      }
      if (this.settings.getData().general?.demoMode) {
        this.localstorageService.setOnboardingSkipped(
          data.isSkipped,
          this.onbSetup.settings.name
        );
        this.localstorageService.setOnboardingFinished(
          data.isFinished,
          this.onbSetup.settings.name
        );
      } else {
        this.geRx.edit(this.entityName, {
          isFinished: data.isFinished,
          isSkipped: data.isSkipped,
        });
      }

      if (data.contacts) {
        this.onboardingService.sendContacts(data.contacts).subscribe();
      }
    });
  }
}
