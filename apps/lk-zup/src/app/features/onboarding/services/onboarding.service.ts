import {
  ComponentRef,
  inject,
  Injectable,
  WritableSignal,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import {
  ClosedOnboardingInterface,
  ContactsInterface,
  OnboardingActions,
  OnboardingInterface,
  OnboardingItemInterface,
} from '@features/onboarding/interfaces/onboarding.interface';
import { SettingsInterface } from '@shared/features/settings/models/settings.interface';
import { PageStorageInterface } from '@shared/interfaces/storage/page/page-storage.interface';
import { AppService } from '@shared/services/app.service';
import { logDebug, logError } from '@shared/utilits/logger';
import {
  filter,
  firstValueFrom,
  fromEvent,
  Subject,
  SubscriptionLike,
} from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { BackgroundComponent } from '../components/background/background.component';
import { CardComponent } from '../components/card/card.component';
import { TargetComponent } from '../components/target/target.component';
import {
  generateContinueItem,
  generateFormItem,
} from '../utils/item-generator.util';
import { BuilderService } from './builder.service';

@Injectable({
  providedIn: 'root',
})
export class OnboardingService {
  app: AppService = inject(AppService);

  settingsStorage = this.app.storage.settings;

  settings: WritableSignal<SettingsInterface> =
    this.settingsStorage.data.frontend.signal.globalSettings;

  currentPageStorage: PageStorageInterface = this.app.storage.page.current;

  isCurrentPageDataLoaded: WritableSignal<boolean> =
    this.currentPageStorage.data.frontend.signal.isDataLoaded;

  isCurrentPageDataLoaded$ = toObservable(this.isCurrentPageDataLoaded);

  private currentStep = 1;

  private totalSteps = 0;

  private item!: OnboardingItemInterface;

  private nextItem!: OnboardingItemInterface | null;

  private setup!: OnboardingInterface;

  private target: ComponentRef<TargetComponent> | null = null;

  private background: ComponentRef<BackgroundComponent> | null = null;

  private card: ComponentRef<CardComponent> | null = null;

  private supportingCard: ComponentRef<CardComponent> | null = null;

  private destroy$ = new Subject<void>();

  private resized: SubscriptionLike | null = null;

  private supportingCardLoading: Promise<void> | null = null;

  private onClose: (data: ClosedOnboardingInterface) => void = () => {};

  private onStepChange: (step: number, name?: string) => void = () => {};

  constructor(private builder: BuilderService, private router: Router) {
    this.builder.nextStep$.subscribe(async (data) => {
      this.onStepChange(this.currentStep, this.setup.settings.name);
      await this.handleItemAction(data?.type, data?.data as ContactsInterface);
    });

    this.builder.close$.subscribe(() => {
      this.close({
        isFinished: false,
        isSkipped: true,
      });
    });
  }

  async init(setup: OnboardingInterface, step: number = 0): Promise<void> {
    this.removeOpenedStep();
    this.resized = fromEvent(window, 'resize')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(async () => {
        if (this.target) {
          this.builder.removeTarget(this.target);
          if (this.item.targetSelector) {
            this.target = await this.builder.addTarget(this.item);
          }
        }
        if (this.card) {
          this.builder.renderCard(this.card, {
            nextCard: this.card as ComponentRef<CardComponent>,
            targetBoundaries: this.target?.instance?.boundaries,
          });
        }
      });
    this.setup = setup;
    this.totalSteps = this.setup.items.length;
    const stepIndex = step;
    if (
      stepIndex &&
      stepIndex < this.totalSteps - 1 &&
      this.setup.settings.continueFromLastStep
    ) {
      this.currentStep = stepIndex;
      this.item = generateContinueItem(
        this.setup.settings,
        this.setup.items[stepIndex]?.path
      );
    } else {
      this.currentStep = 1;
      this.item = this.setup.items[this.currentStep - 1];
    }
    if (!this.item) {
      this.close({
        isFinished: false,
        isSkipped: false,
      });
      logError(new Error(`Item with step ${this.currentStep} not found`));
    }
    await this.renderSupportingCard(this.item);
    await this.buildStep();
  }

  setCloseListener(onClose: (data: ClosedOnboardingInterface) => void): void {
    this.onClose = onClose;
  }

  setChangingStepListener(
    onStepChange: (step: number, name?: string) => void
  ): void {
    this.onStepChange = onStepChange;
  }

  // The point is that we have 3 entities: background, target and card.
  // 1) Background is rendered once, and then we will just change it if it requires.
  // 2) Target is rendered every time when we change step.
  // And before render a new target, the old one should be removed.
  // 3) There are always 2 cards: a supporting card and a main card.
  // Supporting card contains next step content, and main card contains current step content.
  // It's required to render next card out of view and get its sizes
  // to make animations smoother and preload image.
  private async buildStep(): Promise<void> {
    if (this.currentStep < this.totalSteps) {
      this.nextItem = this.setup.items[this.currentStep];
    } else {
      this.nextItem = null;
    }

    if (
      this.item.action === 'openForm' ||
      this.item.linkAction === 'openForm'
    ) {
      this.nextItem = generateFormItem(this.setup.settings);
    }

    if (this.item.path && window.location.pathname !== this.item.path) {
      await this.router.navigate([this.item.path]);
    }

    if (this.target) {
      this.builder.removeTarget(this.target);
    }

    let supportingCardLoaded = Promise.resolve();
    if (this.supportingCardLoading) {
      this.builder.wait();
      supportingCardLoaded = this.supportingCardLoading;
      this.supportingCardLoading = null;
    }
    await supportingCardLoaded;
    this.builder.stopWaiting();

    if (this.background) {
      this.builder.changeBackground(this.background, this.item);
    } else {
      this.background = this.builder.addBackground(this.item);
    }

    if (this.item.targetSelector) {
      this.target = await this.builder.addTarget(this.item);
      if (!this.target) {
        this.close({
          isFinished: false,
          isSkipped: false,
        });
        return;
      }
    }

    if (!this.card) {
      this.card = await this.builder.prepareCard(
        this.item,
        {
          current: this.currentStep,
          total: this.totalSteps,
        },
        this.target?.instance?.boundaries
      );
    } else {
      this.card = this.builder.changeCard(
        this.card as ComponentRef<CardComponent>,
        this.item,
        {
          current: this.currentStep,
          total: this.totalSteps,
        }
      );
    }
    this.builder.renderCard(this.card, {
      nextCard: this.supportingCard as ComponentRef<CardComponent>,
      targetBoundaries: this.target?.instance?.boundaries,
    });

    // render a supporting card out of view,
    // to know the size of the next card before actually render it
    this.supportingCardLoading = this.renderSupportingCard(this.nextItem);
  }

  private async renderSupportingCard(
    item: OnboardingItemInterface | null
  ): Promise<void> {
    try {
      if (item) {
        if (!this.supportingCard) {
          this.supportingCard = await this.builder.prepareCard(item, {
            current: this.currentStep + 1,
            total: this.totalSteps,
          });
          this.builder.detectCardChanges(this.supportingCard);
        } else {
          this.supportingCard = this.builder.changeCard(
            this.supportingCard,
            item,
            {
              current: this.currentStep + 1,
              total: this.totalSteps,
            }
          );
          this.builder.detectCardChanges(this.supportingCard);
          await this.builder.renderCardsLottie(this.supportingCard);
        }
      } else if (this.supportingCard) {
        this.builder.removeCard(this.supportingCard);
        this.supportingCard = null;
      }
    } catch (e) {
      logError(e, 'render supportingCard');
    }
  }

  private async handleItemAction(
    type?: OnboardingActions,
    data?: ContactsInterface
  ): Promise<void> {
    this.currentStep += 1;

    let action = type || this.item.action;

    // Если отключён демо-режим, то при нажатии кнопки "Согласен" просто переходим на главную страницу приложения и закрываем онбординг
    if (!this.settings()?.general.demoMode && action === 'openForm') {
      action = 'end';
    }

    switch (action) {
      case 'next':
        if (this.currentStep <= this.totalSteps) {
          this.item = this.setup.items[this.currentStep - 1];
        }
        await this.buildStep();
        break;
      case 'route':
        await this.router.navigate([this.item.actionRedirect]);

        // (!!!) ACHTUNG роутер navigate дождались, но на практике данные компонентов всё ещё подгружаются из-за своей асинхронной природы (HTTP-запросы),
        // поэтому билдить шаг здесь ещё рано -> нужно обязательно дождаться полной загрузки данных, иначе вся последующая логика не будет работать как задумано
        // в ситуациях, когда целевой элемент (который подсвечиваем) — это элемент списка загружаемых данных (как в случае с заявкой на отпуск)

        // временное решение (для страницы создания заявки) -> по-хорошему нужно будет для каждой страницы задавать
        // значение сигнала isDataLoaded в app.storage.page -> current.data.frontend.signal после загрузки всех
        // необходимых данных для отображения страницы
        if (this.item.actionRedirect === '/issues/types') {
          if (!this.isCurrentPageDataLoaded()) {
            logDebug('[user-help]: Ожидание загрузки списка заявок...');
            await firstValueFrom(
              this.isCurrentPageDataLoaded$.pipe(filter((value) => value))
            );
            logDebug('[user-help]: Список заявок загружен.');

            // ждём пару с лишним секунд на случай, если элемент по какой-то причине ещё не успел отрисоваться
            await new Promise((resolve) => setTimeout(resolve, 2500));
          }
        }

        if (this.currentStep <= this.totalSteps) {
          this.item = this.setup.items[this.currentStep - 1];
        }
        await this.buildStep();
        break;
      case 'openForm':
        this.item = generateFormItem(this.setup.settings);
        await this.buildStep();
        break;
      case 'submit':
        await this.router.navigate(['/']);
        this.close({
          isFinished: true,
          isSkipped: false,
          contacts: data,
        });
        break;
      case 'end':
        await this.router.navigate(['/']);
        this.close({
          isFinished: true,
          isSkipped: false,
        });
        break;
      default:
        await this.router.navigate(['/']);
        break;
    }
  }

  private removeOpenedStep(): void {
    this.destroy$.next();
    if (this.resized) {
      this.resized.unsubscribe();
      this.resized = null;
    }

    if (this.target) {
      this.builder.removeTarget(this.target);
      this.target = null;
    }
    if (this.background) {
      this.builder.removeBackground(this.background);
      this.background = null;
    }
    if (this.card) {
      this.builder.closeCard(this.card);
      this.card = null;
    }
    if (this.supportingCard) {
      this.builder.removeCard(this.supportingCard);
      this.card = null;
    }
  }

  private close(data: {
    isFinished: boolean;
    isSkipped: boolean;
    contacts?: ContactsInterface;
  }): void {
    this.removeOpenedStep();
    // this.router.navigate(['/']);
    this.onClose({
      ...data,
      stepIndex: this.currentStep - 1,
      contacts: data?.contacts,
    });
  }
}
