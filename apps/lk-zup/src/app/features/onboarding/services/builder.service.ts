import {
  ApplicationRef,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  Injectable,
  Injector,
} from '@angular/core';
import { BehaviorSubject, Subject, SubscriptionLike } from 'rxjs';
import { BackgroundComponent } from '../components/background/background.component';
import { CardComponent } from '../components/card/card.component';
import { TargetComponent } from '../components/target/target.component';
import {
  ContactsInterface,
  OnboardingActions,
  OnboardingItemInterface,
} from '../interfaces/onboarding.interface';

@Injectable({
  providedIn: 'root',
})
export class BuilderService {
  private cardFactory!: ComponentFactory<CardComponent>;

  private targetFactory!: ComponentFactory<TargetComponent>;

  private backgroundFactory!: ComponentFactory<BackgroundComponent>;

  private subscriptions: SubscriptionLike[] = [];

  private nextStep = new Subject<
    | {
        type?: OnboardingActions;
        data?: void | ContactsInterface;
      }
    | undefined
  >();

  readonly nextStep$ = this.nextStep.asObservable();

  private close = new Subject<void>();

  readonly close$ = this.close.asObservable();

  private loading$ = new BehaviorSubject<boolean>(false);

  constructor(
    private cfr: ComponentFactoryResolver,
    private injector: Injector,
    private app: ApplicationRef
  ) {
    this.cardFactory = this.cfr.resolveComponentFactory(CardComponent);
    this.targetFactory = this.cfr.resolveComponentFactory(TargetComponent);
    this.backgroundFactory =
      this.cfr.resolveComponentFactory(BackgroundComponent);
  }

  async addTarget(
    item: OnboardingItemInterface
  ): Promise<ComponentRef<TargetComponent>> {
    this.loading$.next(true);
    if (!item.targetSelector) {
      throw new Error('Selector is required to add target');
    }
    const componentRef = this.targetFactory.create(this.injector);
    this.app.attachView(componentRef.hostView);
    componentRef.instance.init(item);
    componentRef.instance.setClickHandler(() => {
      this.nextStep.next(undefined);
    });
    const targetEl = await componentRef.instance.clonedEl$.toPromise();
    document.body.appendChild(componentRef.location.nativeElement);
    this.loading$.next(false);
    if (!targetEl) {
      this.nextStep.next({ type: 'next' });
    }
    return componentRef;
  }

  removeTarget(ref: ComponentRef<TargetComponent>): void {
    if (this.subscriptions) {
      this.subscriptions.forEach((sub) => sub.unsubscribe());
    }
    this.app.detachView(ref.hostView);
    ref.destroy();
  }

  async prepareCard(
    item: OnboardingItemInterface,
    steps: {
      current: number;
      total: number;
    },
    targetBoundaries?: DOMRect
  ): Promise<ComponentRef<CardComponent>> {
    const componentRef = this.cardFactory.create(this.injector);
    this.app.attachView(componentRef.hostView);
    componentRef.instance.setClickHandler(
      (type?: OnboardingActions, data?: ContactsInterface) => {
        this.nextStep.next({ type, data });
      }
    );
    componentRef.instance.setCloseHandler(() => {
      this.close.next();
    });
    componentRef.instance.init({
      item,
      steps,
      targetBoundaries,
    });
    componentRef.instance.setLoading(this.loading$);
    document.body.appendChild(componentRef.location.nativeElement);
    if (!item?.image) {
      return new Promise((resolve) => {
        componentRef.instance.setInitHandler(() => {
          resolve(componentRef);
        });
      });
    }
    return new Promise((resolve) => {
      componentRef.instance.setImageLoadedHandler(() => {
        resolve(componentRef);
      });
    });
  }

  renderCard(
    ref: ComponentRef<CardComponent>,
    position: {
      nextCard: ComponentRef<CardComponent>;
      targetBoundaries?: DOMRect;
    }
  ): ComponentRef<CardComponent> {
    ref.instance.setSizesByNextCard(position.nextCard.instance.getSizes());
    ref.instance.replaceIntoView(
      position?.targetBoundaries,
      position.nextCard.instance.getAnimationClonedData()
    );
    return ref;
  }

  async closeCard(ref: ComponentRef<CardComponent>): Promise<void> {
    await ref.instance.hide();
    this.removeCard(ref);
  }

  changeCard(
    ref: ComponentRef<CardComponent>,
    item: OnboardingItemInterface,
    steps: {
      current: number;
      total: number;
    }
  ): ComponentRef<CardComponent> {
    ref.instance.setItem(item);
    ref.instance.setSteps(steps);
    return ref;
  }

  wait(): void {
    this.loading$.next(true);
  }

  stopWaiting(): void {
    this.loading$.next(false);
  }

  async renderCardsLottie(
    ref: ComponentRef<CardComponent>
  ): Promise<ComponentRef<CardComponent>> {
    ref.instance.renderLottie();
    return new Promise((resolve) => {
      ref.instance.setImageLoadedHandler(() => {
        resolve(ref);
      });
    });
  }

  detectCardChanges(
    ref: ComponentRef<CardComponent>
  ): ComponentRef<CardComponent> {
    ref.instance.detectChanges();
    return ref;
  }

  removeCard(ref: ComponentRef<CardComponent>): void {
    this.app.detachView(ref.hostView);
    ref.destroy();
  }

  addBackground(
    item: OnboardingItemInterface
  ): ComponentRef<BackgroundComponent> | null {
    document.body.style.overflow = 'hidden';
    const componentRef = this.backgroundFactory.create(this.injector);
    this.app.attachView(componentRef.hostView);
    document.body.appendChild(componentRef.location.nativeElement);
    componentRef.instance.setItem(item);
    return componentRef;
  }

  changeBackground(
    ref: ComponentRef<BackgroundComponent>,
    item: OnboardingItemInterface
  ): void {
    ref.instance.setItem(item);
  }

  removeBackground(ref: ComponentRef<BackgroundComponent>): void {
    document.body.style.overflow = '';
    this.app.detachView(ref.hostView);
    ref.destroy();
  }
}
