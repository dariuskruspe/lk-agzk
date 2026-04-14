import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  NgZone,
  OnDestroy,
  ViewEncapsulation,
} from '@angular/core';
import {
  OnboardingItemInterface,
  OnboardingTargetPositionPxInterface,
} from '@features/onboarding/interfaces/onboarding.interface';
import { logDebug, logWarn } from '@shared/utilits/logger';
import { elementIsVisibleInViewport } from '@shared/utils/DOM/common';
import { ReplaySubject, Subject, asyncScheduler, fromEvent } from 'rxjs';
import { debounceTime, observeOn, take, takeUntil } from 'rxjs/operators';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'onb-target',
    templateUrl: './target.component.html',
    styleUrls: ['./target.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    standalone: false
})
export class TargetComponent implements OnDestroy {
  private clone!: HTMLElement;

  item!: OnboardingItemInterface;

  boundaries!: DOMRect;

  position!: OnboardingTargetPositionPxInterface;

  private el = new Subject<HTMLElement | null>();

  private clonedEl = new ReplaySubject<HTMLElement | null>(1);

  readonly clonedEl$ = this.clonedEl.asObservable();

  isHighlighted = false;

  private destroy$ = new Subject<void>();

  onClick: () => void = () => {};

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  constructor(private cdr: ChangeDetectorRef, private zone: NgZone) {
    this.el
      .pipe(take(1), observeOn(asyncScheduler, 100), takeUntil(this.destroy$))
      .subscribe(async (el) => {
        if (el) {
          // const isInViewport = this.isInViewport(el);
          const isInViewport = elementIsVisibleInViewport(el);

          if (!isInViewport && this.item?.scrollContainerSelector) {
            this.scrollToElementAndClone(el);
          } else {
            this.calculatePositionsAndClone(el);
          }
        } else {
          this.clonedEl.next(null);
          this.clonedEl.complete();
        }
      });
  }

  clickTarget(): void {
    if (!this.item?.untouchableTarget) {
      this.onClick();
    }
  }

  init(item: OnboardingItemInterface): void {
    this.item = item;
    this.isHighlighted = item?.highlightTarget || false;
    // (!!!) выбор элемента должен происходить только после полной загрузки всех связанных с ним необходимых данных, отображаемых на странице (например, данных списка заявок — для случая с выбором элемента заявки на отпуск)
    // временно решается setTimeout'ом с задержкой, достаточной для загрузки необходимых данных...
    this.select(this.item?.targetSelector as string);
  }

  setClickHandler(handler: () => void): void {
    // // remove click during step's changing to avoid artifacts
    // this.zone.runOutsideAngular(() => {
    //   setTimeout(() => {
    //     this.onClick = handler;
    //   }, 2000);
    // });
    this.onClick = handler;
  }

  private select(selector: string): void {
    let el = document.querySelector(selector) as HTMLElement;
    logDebug(`[target.component.ts]: select -> el:`, el);
    if (!el) {
      const timer = setTimeout(() => {
        this.el.next(null);
        this.el.complete();
        logWarn(`Element with selector ${selector} not found`);
      }, 7000);

      const config = { childList: true, subtree: true };
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          const addedNodes = Array.from(mutation.addedNodes);
          const matchingNodes = addedNodes.filter((node) =>
            (node as HTMLElement)?.matches?.(selector)
          );
          if (matchingNodes.length) {
            clearTimeout(timer);

            // наблюдаемый элемент может быть добавлен в DOM, но ещё не отрисован браузером (и как следствие
            // вызов getBoundingClientRect будет выдавать нулевые значения свойств в объекте, что приведёт к
            // неправильной работе функции проверки наличия элемента в области просмотра [viewport]), поэтому
            // дожидаемся следующего кадра рендеринга браузера и выполняем это вне зоны Angular во избежание
            // потенциально возможных проблем с производительностью приложения из-за механизма обнаружения
            // изменений Angular
            this.zone.runOutsideAngular(() => {
              requestAnimationFrame(() => {
                el = matchingNodes[0] as HTMLElement;
                const boundingClientRect = el.getBoundingClientRect();
                if (!boundingClientRect.width || !boundingClientRect.height) {
                  return;
                }
                this.el.next(el);
                this.el.complete();
                observer.disconnect();
              });
            });
          }
        });
      });
      observer.observe(document.body, config);
    } else {
      this.el.next(el);
      this.el.complete();
    }
  }

  private scrollToElementAndClone(el: HTMLElement): void {
    const container =
      el.closest(this.item.scrollContainerSelector as string) ||
      (document.querySelector(
        this.item.scrollContainerSelector as string
      ) as HTMLElement);
    if (!container) {
      throw new Error('Scroll container not found');
    }

    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        container.scrollTo({
          top: el.offsetTop - 100,
          behavior: 'smooth',
        });

        fromEvent(container, 'scroll')
          .pipe(debounceTime(200), take(1), takeUntil(this.destroy$))
          .subscribe(() => {
            this.calculatePositionsAndClone(el);
          });
      }, 300);
    });
  }

  private calculatePositionsAndClone(el: HTMLElement): void {
    this.boundaries = el.getBoundingClientRect();
    this.position = {
      'left.px': this.boundaries.left,
      'top.px': this.boundaries.top,
      'width.px': this.boundaries.width,
      'height.px': this.boundaries.height,
    };

    this.makeDeepClone(el);
  }

  private makeDeepClone(el: HTMLElement): void {
    const styles = window.getComputedStyle(el);
    let { cssText } = styles;
    if (!cssText) {
      cssText = Array.from(styles).reduce((str, property) => {
        return `${str}${property}:${styles.getPropertyValue(property)};`;
      }, '');
    }
    this.clone = el.cloneNode(true) as HTMLElement;
    this.clone.style.cssText = cssText;
    this.clone.style.pointerEvents = 'none';
    this.clonedEl.next(this.clone);
    this.clonedEl.complete();
  }

  private isInViewport(element: HTMLElement): boolean {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
}
