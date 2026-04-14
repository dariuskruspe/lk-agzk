import { Injectable } from '@angular/core';
import { OnboardingFacade } from '@shared/features/onboarding/facades/onboarding.facade';
import { LocalStorageService } from '@shared/services/local-storage.service';

/**
 * Вспомогательный сервис для "онбординга" (интерактивного тура по системе)
 */
@Injectable({
  providedIn: 'root',
})
export class OnboardingHelperService {
  constructor(
    // Other
    private localstorageService: LocalStorageService,
    public onboardingFacade: OnboardingFacade
  ) {}

  /**
   * Функция-обработчик нажатия на кнопку "Повторить ознакомление" [ЛКС - Профиль - Поддержка - Ознакомление с EmplDocs].
   * Повторяет [показывает заново] "онбординг" (интерактивный тур по системе) после перезагрузки страницы.
   */
  repeat(name: string): void {
    // skuzminov: метод аккуратно украден и перенесён сюда из support-onboarding-container.component.ts ^_^ (см. задачу HRM-39153)
    switch (name) {
      case 'welcome':
        // "Welcome" [добро пожаловать] (ознакомительный интерактивный тур по системе)
        this.localstorageService.clearOnboardingStep(name);
        this.localstorageService.setOnboardingFinished(false, name);
        this.localstorageService.setOnboardingSkipped(false, name);
        this.onboardingFacade.edit({
          isFinished: false,
          isSkipped: false,
        });
        break;
      default:
        break;
    }
  }
}
