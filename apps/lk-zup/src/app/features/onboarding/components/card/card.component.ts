import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  NgZone,
  OnDestroy,
  ViewChild,
  ViewEncapsulation,
  WritableSignal,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SettingsInterface } from '@shared/features/settings/models/settings.interface';
import { AppService } from '@shared/services/app.service';
import { logError, logWarn } from '@shared/utilits/logger';
import cloneDeep from 'lodash/cloneDeep';
import lottie, { AnimationItem } from 'lottie-web';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Movable } from '../../classes/movable.class';
import {
  ContactsInterface,
  OnboardingActions,
  OnboardingItemInterface,
  OnboardingPositionPxInterface,
  Position,
} from '../../interfaces/onboarding.interface';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'onb-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    standalone: false
})
export class CardComponent implements OnDestroy {
  app: AppService = inject(AppService);

  settingsStorage = this.app.storage.settings;

  settings: WritableSignal<SettingsInterface> =
    this.settingsStorage.data.frontend.signal.globalSettings;

  public item!: OnboardingItemInterface;

  public item$: ReplaySubject<OnboardingItemInterface> =
    new ReplaySubject<OnboardingItemInterface>();

  public sizes!: OnboardingPositionPxInterface;

  public steps!: {
    current: number;
    total: number;
  };

  public loading$!: Observable<boolean>;

  public isImage = false;

  public formGroup: FormGroup = new FormGroup({
    name: new FormControl('', { validators: [Validators.required] }),
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
    }),
    phone: new FormControl('', { validators: [Validators.required] }),
    comment: new FormControl('', { validators: [Validators.required] }),
  });

  public hasError = false;

  private updatedSizes!: {
    width: number;
    height: number;
  };

  private targetBoundaries: DOMRect | null = null;

  private animation!: AnimationItem;

  private movableItem!: Movable;

  private destroy$ = new Subject<void>();

  private isRevealed = false;

  @ViewChild('card') card!: ElementRef;

  @ViewChild('movable') movableRef!: ElementRef;

  @ViewChild('lottie') lottieRef!: ElementRef;

  onClose: () => void = () => {};

  onClick: (type?: OnboardingActions, data?: ContactsInterface) => void =
    () => {};

  onInit: () => void = () => {};

  onLoad: () => void = () => {};

  constructor(private zone: NgZone, private cdr: ChangeDetectorRef) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    try {
      this.animation.destroy();
    } catch (e) {
      logWarn(e, 'error destroying animations');
    }
  }

  init(data: {
    item: OnboardingItemInterface;
    steps: {
      current: number;
      total: number;
    };
    targetBoundaries?: DOMRect;
  }): void {
    this.setSteps(data.steps);
    this.setItem(data.item);
    if (data?.targetBoundaries) {
      this.targetBoundaries = data.targetBoundaries;
    }
    this.sizes = this.getCardSizes();
    this.detectChanges();
    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.renderLottie();
        this.createAnimatedItem();
        this.onInit();
      });
    });
  }

  setSteps(steps: { current: number; total: number }): void {
    this.steps = steps;
  }

  setItem(item: OnboardingItemInterface): void {
    this.item = item;
    this.isImage = !item.image?.endsWith('.json');
  }

  detectChanges(): void {
    this.item$.next(this.item);
    this.cdr.detectChanges();
  }

  getSizes(): { width: number; height: number } {
    return {
      width: this.card.nativeElement.clientWidth,
      height: this.card.nativeElement.clientHeight,
    };
  }

  setSizesByNextCard(nextCard: { width: number; height: number }): void {
    this.updatedSizes = {
      width: nextCard.width,
      height: nextCard.height,
    };
  }

  async hide(): Promise<void> {
    return this.movableItem.hide();
  }

  replaceIntoView(
    targetBoundaries?: DOMRect,
    prevAnimation?: {
      animationData: any;
      element: HTMLElement;
    }
  ): void {
    // // remove click during step's changing to avoid artifacts
    // const originalClick = this.onClick;
    // this.onClick = () => {};
    // // put click back after sometime
    // this.zone.runOutsideAngular(() => {
    //   setTimeout(() => {
    //     this.onClick = originalClick;
    //   }, 2000);
    // });

    if (targetBoundaries) {
      this.targetBoundaries = targetBoundaries;
    }
    let position: OnboardingPositionPxInterface;
    const possibleTargetPositions = ['left', 'right', 'top', 'bottom'];
    if (
      this.item.position &&
      this.targetBoundaries &&
      possibleTargetPositions.includes(this.item.position)
    ) {
      position = this.getTargetPosition(this.item.position);
    } else {
      position = this.getNonTargetPosition();
    }

    let shrinked = Promise.resolve();
    if (this.isRevealed) {
      shrinked = this.movableItem.moveTo(
        position.x as number,
        position.y as number
      );
    } else {
      this.movableItem.reveal(position.x as number, position.y as number);
      this.isRevealed = true;
    }

    shrinked.then(() => {
      this.sizes['width.px'] = this.updatedSizes.width || this.item.width;
      this.detectChanges();
      this.renderLottie(prevAnimation);
    });
  }

  setCloseHandler(handler: () => void): void {
    this.onClose = handler;
  }

  setClickHandler(
    handler: (t?: OnboardingActions, d?: ContactsInterface) => void
  ): void {
    this.onClick = handler;
  }

  setImageLoadedHandler(handler: () => void): void {
    this.onLoad = handler;
  }

  setInitHandler(handler: () => void): void {
    this.onInit = handler;
  }

  setLoading(loading: Observable<boolean>): void {
    this.zone.runOutsideAngular(() => {
      this.loading$ = loading.pipe(debounceTime(500), takeUntil(this.destroy$));
      this.loading$.subscribe((isLoading) => {
        if (isLoading) {
          this.movableItem.wait();
        }
      });
    });
  }

  renderLottie(data?: { animationData: any; element: HTMLElement }): void {
    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        if (!this.isImage && this.item?.image) {
          try {
            this.animation.removeEventListener('loaded_images', this.onLoad);
            this.animation.removeEventListener('DOMLoaded', this.onLoad);
            this.animation.destroy();
          } catch (e) {
            logWarn(e, 'render animation error');
          }

          try {
            if (data) {
              const fragment = document.createDocumentFragment();
              Array.from(data.element.children).forEach((child) => {
                fragment.appendChild(child);
              });
              this.lottieRef.nativeElement.innerHTML = '';
              this.lottieRef.nativeElement.appendChild(data.element);
              this.animation = lottie.loadAnimation({
                container: data.element,
                renderer: 'svg',
                loop: true,
                autoplay: true,
                animationData: data.animationData,
                assetsPath: `${this.item?.image
                  .split('/')
                  .slice(0, -1)
                  .join('/')}/images/`,
              });
            } else {
              this.animation = lottie.loadAnimation({
                container: this.lottieRef.nativeElement,
                renderer: 'svg',
                loop: true,
                autoplay: true,
                path: this.item?.image,
              });
            }

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (this.animation?.assets?.length) {
              this.animation.addEventListener('loaded_images', this.onLoad);
            } else {
              this.animation.addEventListener('DOMLoaded', this.onLoad);
            }

            this.cdr.detectChanges();
          } catch (e) {
            this.onLoad();
            logError(e, 'card render animation error');
          }
        } else {
          this.onLoad();
        }
      });
    });
  }

  createAnimatedItem(): void {
    this.movableItem = new Movable(
      this.movableRef.nativeElement as HTMLElement
    );
  }

  submitForm(): void {
    this.formGroup.markAsTouched();
    this.formGroup.markAsDirty();
    if (this.formGroup.valid) {
      this.onClick(this.item.action, this.formGroup.value as ContactsInterface);
      return;
    }
    this.hasError = true;
  }

  getAnimationClonedData():
    | {
        animationData: any;
        element: HTMLElement;
      }
    | undefined {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (!this.animation?.animationData || !this.lottieRef?.nativeElement) {
      return;
    }

    // eslint-disable-next-line consistent-return
    return {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      animationData: cloneDeep(this.animation?.animationData),
      element: this.lottieRef?.nativeElement.cloneNode(true) as HTMLElement,
    };
  }

  private getTargetPosition(
    itemPosition: Position
  ): OnboardingPositionPxInterface {
    if (!this.targetBoundaries) {
      throw new Error('Target is not defined');
    }
    const { height, width } = this.updatedSizes;
    const targetPosition = this.targetBoundaries;
    let cardPosition: OnboardingPositionPxInterface = {};
    const windowHeight =
      window.innerHeight || document.documentElement.clientHeight;
    const windowWidth =
      window.innerWidth || document.documentElement.clientWidth;
    const targetHorizontalCenter =
      targetPosition.left + targetPosition.width / 2;
    const targetVerticalCenter = targetPosition.top + targetPosition.height / 2;
    const isTargetOnLeftWindowSide = targetHorizontalCenter <= windowWidth / 2;
    const isTargetOnUpperWindowSide = targetVerticalCenter <= windowHeight / 2;
    const horizontalGap =
      windowWidth - width < 0 ? 0 : (windowWidth - width) / 2;
    const verticalGap =
      windowHeight - height < 0 ? 0 : (windowHeight - height) / 2;

    function calculateHorizontalPosition(): number {
      if (horizontalGap === 0) {
        return 0;
      }
      if (targetPosition.width >= windowWidth / 2) {
        return horizontalGap;
      }
      if (isTargetOnLeftWindowSide) {
        return targetPosition.left < horizontalGap
          ? targetPosition.left
          : horizontalGap;
      }
      return windowWidth - (targetPosition.left + targetPosition.width) <
        horizontalGap
        ? targetPosition.left + targetPosition.width - width
        : horizontalGap;
    }

    function calculateVerticalPosition(): number {
      if (verticalGap === 0) {
        return 0;
      }
      if (targetPosition.height >= windowHeight / 2) {
        return verticalGap;
      }
      if (isTargetOnUpperWindowSide) {
        return targetPosition.top < verticalGap
          ? targetPosition.top
          : verticalGap;
      }
      return windowHeight - (targetPosition.top + targetPosition.height) <
        verticalGap
        ? targetPosition.top + targetPosition.height - height
        : verticalGap;
    }

    switch (itemPosition) {
      case 'top':
        cardPosition.x = calculateHorizontalPosition();
        cardPosition.y = targetPosition.top - (height + 10);
        break;
      case 'bottom':
        cardPosition.x = calculateHorizontalPosition();
        cardPosition.y = targetPosition.bottom + 10;
        break;
      case 'right':
        cardPosition.x = targetPosition.left + targetPosition.width + 10;
        cardPosition.y = calculateVerticalPosition();
        break;
      case 'left':
        cardPosition.x = targetPosition.left - (width + 10);
        cardPosition.y = calculateVerticalPosition();
        break;
      default:
        cardPosition = this.getNonTargetPosition();
        break;
    }

    cardPosition['width.px'] = width || this.item?.width || 400;

    return cardPosition;
  }

  private getNonTargetPosition(): OnboardingPositionPxInterface {
    const windowHeight =
      window.innerHeight || document.documentElement.clientHeight;
    const windowWidth =
      window.innerWidth || document.documentElement.clientWidth;
    const { width, height } = this.updatedSizes;
    const xIndent = this.item.indent?.[0] ?? 0;
    const yIndent = this.item.indent?.[1] ?? this.item.indent?.[0] ?? 0;
    let yPoint = 0;
    let xPoint = 0;

    switch (this.item.position) {
      case 'top':
        yPoint = yIndent;
        xPoint = windowWidth / 2 - width / 2 + xIndent;
        break;
      case 'left':
        yPoint = windowHeight / 2 - height / 2 + yIndent;
        xPoint = xIndent;
        break;
      case 'right':
        yPoint = windowHeight / 2 - height / 2 + yIndent;
        xPoint = windowWidth - width + xIndent;
        break;
      case 'bottom':
        yPoint = windowHeight - height + yIndent;
        xPoint = windowWidth / 2 - width / 2 + xIndent;
        break;
      case 'top-left':
        yPoint = yIndent;
        xPoint = xIndent;
        break;
      case 'top-right':
        yPoint = yIndent;
        xPoint = windowWidth - width + xIndent;
        break;
      case 'bottom-left':
        yPoint = windowHeight - height + yIndent;
        xPoint = xIndent;
        break;
      case 'bottom-right':
        yPoint = windowHeight - height + yIndent;
        xPoint = windowWidth - width + xIndent;
        break;
      default:
        yPoint = windowHeight / 2 - height / 2;
        xPoint = windowWidth / 2 - width / 2;
        break;
    }
    const cardPosition: OnboardingPositionPxInterface = {};
    cardPosition.x = xPoint;
    cardPosition.y = yPoint;
    cardPosition['width.px'] = width || this.item?.width || 400;
    return cardPosition;
  }

  private getCardSizes(): OnboardingPositionPxInterface {
    const position: OnboardingPositionPxInterface = {};
    position['width.px'] = this.item?.width || 400;
    return position;
  }
}
