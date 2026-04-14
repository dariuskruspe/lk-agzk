export class Movable {
  private movable!: HTMLElement;

  private animated!: HTMLElement;

  private body!: HTMLElement;

  private readonly animatedContainerClass: string =
    'onboarding__animated-container';

  private readonly bodyClass: string = 'onboarding__body-container';

  private readonly bounceClass: string = 'onboarding__bounce';

  private readonly coverClass: string = 'onboarding__cover';

  private readonly loadingClass: string = 'onboarding__infinite-loading';

  private readonly bounceOutClass: string = 'onboarding__bounceOutUp';

  private readonly shrinkClass: string = 'onboarding__shrink';

  private readonly expandClass: string = 'onboarding__expand';

  private readonly moveTransition: string =
    'transform .8s cubic-bezier(.62,-1.13,.45,2.11)';

  private readonly revealTransition: string =
    'transform .4s cubic-bezier(.4,.25,.94,.62)';

  constructor(
    el: HTMLElement,
    animatedContainerClass?: string,
    bodyContainerClass?: string
  ) {
    if (animatedContainerClass) {
      this.animatedContainerClass = animatedContainerClass;
    }
    if (bodyContainerClass) {
      this.bodyClass = bodyContainerClass;
    }
    this.movable = el;
    this.animated = el.querySelector(
      `.${this.animatedContainerClass}`
    ) as HTMLElement;
    if (!this.animated) {
      throw new Error('Animated container is required');
    }
    this.body = el.querySelector(`.${this.bodyClass}`) as HTMLElement;
    if (!this.body) {
      throw new Error('Body container is required');
    }
  }

  async wait(): Promise<void> {
    await this.shrink();
    this.setLoading();
  }

  async reveal(x: number, y: number): Promise<void> {
    this.pauseLoading();
    await this.shrink();
    this.movable.style.transition = 'none';
    this.movable.style.transform = `translate(${x}px, -400px)`;
    await this.dropTo(x, y);
    await this.bounce();
    await this.expand();
  }

  async moveTo(x: number, y: number): Promise<void> {
    this.pauseLoading();
    await this.shrink();
    // it is necessary to resolve the promise just after shrinking (to generate new content)
    this.toCoords(x, y).then(() => {
      this.expand();
    });
  }

  private async dropTo(x: number, y: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const afterMoved = () => {
          resolve();
          this.movable.removeEventListener('transitionend', afterMoved);
        };
        this.movable.addEventListener('transitionend', afterMoved);

        this.movable.style.transition = this.revealTransition;
        this.movable.style.transform = `translate(${x}px, ${y}px)`;
      }, 100);
    });
  }

  private async toCoords(x: number, y: number): Promise<void> {
    const domrect = this.movable.getBoundingClientRect();
    if (domrect.x === x && domrect.y === y) {
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        resolve();
      }, 1000);
      const afterMoved = () => {
        clearTimeout(timer);
        resolve();
        this.movable.removeEventListener('transitionend', afterMoved);
      };

      this.movable.addEventListener('transitionend', afterMoved);

      this.movable.style.transition = this.moveTransition;
      this.movable.style.transform = `translate(${x}px, ${y}px)`;
    });
  }

  async hide(): Promise<void> {
    return new Promise((resolve) => {
      this.animated.classList.remove(this.loadingClass);
      const hide = () => {
        this.movable.style.opacity = '0';
        resolve();
        this.body.removeEventListener('animationend', hide);
      };

      this.movable.style.overflow = 'visible';
      this.body.addEventListener('animationend', hide);

      this.body.classList.add(this.bounceOutClass);
    });
  }

  private setLoading(): void {
    this.animated.style.backgroundColor = '';
    this.animated.classList.remove(this.bounceClass);
    this.movable.style.overflow = 'visible';
    this.body.style.opacity = '0';
    this.animated.classList.add(this.loadingClass);
  }

  private pauseLoading(): void {
    this.animated.classList.remove(this.loadingClass);
    this.movable.style.overflow = 'hidden';
    this.body.style.opacity = '1';
  }

  private async bounce(): Promise<void> {
    this.animated.classList.remove(this.loadingClass);
    this.movable.style.overflow = 'visible';
    this.body.style.opacity = '0';
    this.animated.classList.add(this.bounceClass);
    return new Promise((resolve) => {
      const onBounce = () => {
        resolve();
        this.animated.classList.remove(this.loadingClass);
        this.movable.style.overflow = 'hidden';
        this.animated.removeEventListener('animationend', onBounce);
      };
      this.animated.addEventListener('animationend', onBounce);
    });
  }

  async shrink(): Promise<void> {
    if (this.movable.classList.contains(this.shrinkClass)) {
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      this.animated.classList.remove(this.loadingClass);
      const onShrink = () => {
        resolve();
        this.movable.removeEventListener('animationend', onShrink);
      };
      this.movable.addEventListener('animationend', onShrink);

      this.movable.style.overflow = 'hidden';
      this.movable.classList.add(this.shrinkClass);
      this.body.classList.add(this.coverClass);
      this.movable.classList.remove(this.expandClass);
    });
  }

  private async expand(): Promise<void> {
    if (this.movable.classList.contains(this.expandClass)) {
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      this.animated.classList.remove(this.loadingClass);

      const onExpand = () => {
        this.animated.classList.remove(this.loadingClass);
        resolve();
        this.movable.removeEventListener('animationend', onExpand);
      };
      this.movable.addEventListener('animationend', onExpand);

      this.animated.style.animationDelay = '0s';
      this.animated.style.backgroundColor = 'transparent';
      this.body.style.opacity = '1';
      this.movable.style.overflow = 'hidden';
      if (this.movable.classList.contains(this.shrinkClass)) {
        this.movable.classList.add(this.expandClass);
        this.body.classList.remove(this.coverClass);
        this.movable.classList.remove(this.shrinkClass);
      }
    });
  }
}
