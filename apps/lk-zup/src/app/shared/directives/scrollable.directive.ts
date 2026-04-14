import {
  AfterContentInit,
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
} from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import PullToRefresh from 'pulltorefreshjs';
import { Subject, fromEvent } from 'rxjs';
import {
  debounceTime,
  filter,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { Environment } from '../classes/ennvironment/environment';
import { LangFacade } from '../features/lang/facades/lang.facade';
import { LangUtils } from '../features/lang/utils/lang.utils';
import { ParseUrlResult, parseUrl } from '../utilits/parse-url.util';

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[scrollable]',
    standalone: false
})
export class ScrollableDirective
  implements OnDestroy, OnChanges, AfterContentInit
{
  @Input() scrollable: 'router' | null = null;

  private destroy$ = new Subject<void>();

  private pullToRefreshRef!: PullToRefresh.PullToRefreshInstance;

  private onTop = true;

  private readonly isNativeMobile = Environment.isMobileApp();

  constructor(
    private elementRef: ElementRef,
    private router: Router,
    private langFacade: LangFacade,
    private langUntil: LangUtils
  ) {
    this.handleMobileGestures();
  }

  ngOnChanges(): void {
    this.handleMobileRedirects();
  }

  ngAfterContentInit(): void {
    const el = this.elementRef.nativeElement.querySelector(
      '*[scrollable__ptr="true"]'
    );
    if (el && this.isNativeMobile) {
      this.pullToRefreshRef = PullToRefresh.init({
        mainElement: el,
        shouldPullToRefresh: () => this.onTop,
        onRefresh: () => {
          const url = parseUrl(this.router.url);
          this.router
            .navigate(['', 'empty_reloading_page'], {
              skipLocationChange: true,
            })
            .then(() => {
              const params = url.isEmpty ? {} : url.params;
              this.router.navigate(url.path, {
                queryParams: params,
                skipLocationChange: true,
              });
            });
        },
        instructionsPullToRefresh: this.langUntil.convert(
          this.langFacade.getLang(),
          'PULL_TO_REFRESH'
        ),
        instructionsReleaseToRefresh: this.langUntil.convert(
          this.langFacade.getLang(),
          'RELEASE_TO_REFRESH'
        ),
        instructionsRefreshing: this.langUntil.convert(
          this.langFacade.getLang(),
          'RELOADING'
        ),
        distThreshold: 100,
        distMax: 130,
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.pullToRefreshRef) {
      this.pullToRefreshRef.destroy();
    }
  }

  // Фикс того, что жесты на мобилке с самого низа и с самого верха, не работают, если начать тянуть сначала в обратную
  // сторону
  private handleMobileGestures(): void {
    let forbidden = false;
    let startY: number;

    fromEvent(this.elementRef.nativeElement, 'touchstart')
      .pipe(
        filter(() => this.onBorder()),
        switchMap((event: TouchEvent) => {
          startY = event.touches[0].clientY;
          this.checkTop();
          return fromEvent(this.elementRef.nativeElement, 'touchmove');
        }),
        tap((event: TouchEvent) => {
          this.checkTop();
          const deltaY = event.touches[0].clientY - startY;
          if (this.isScrollForbidden(deltaY)) {
            forbidden = true;
          }
        }),
        filter(() => forbidden),
        takeUntil(this.destroy$)
      )
      .subscribe((event: TouchEvent) => {
        event.preventDefault();

        const deltaY = event.touches[0].clientY - startY;
        startY = event.touches[0].clientY;

        this.elementRef.nativeElement.scrollTop -= deltaY;
      });

    fromEvent(this.elementRef.nativeElement, 'touchend')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.checkTop();
        forbidden = false;
      });
  }

  // Это костыль, чтоб отменить инерционный скрол и загрузить страницу сверху
  private handleMobileRedirects(): void {
    if (this.scrollable === 'router' && this.isNativeMobile) {
      let parsedUrl: ParseUrlResult;
      this.router.events
        .pipe(
          filter(
            (event) =>
              event instanceof NavigationStart &&
              event.url !== '/empty_reloading_page' &&
              JSON.stringify(parsedUrl?.path || []) !==
                JSON.stringify(parseUrl(event.url).path)
          ),
          tap((e: NavigationStart) => {
            parsedUrl = parseUrl(e.url);
          }),
          switchMap(() =>
            this.router.navigate(['', 'empty_reloading_page'], {
              skipLocationChange: true,
            })
          ),
          debounceTime(50),
          switchMap(() =>
            this.router.navigate(parsedUrl.path, {
              queryParams: parsedUrl.params,
            })
          ),
          takeUntil(this.destroy$)
        )
        .subscribe();
    }
  }

  private isScrollForbidden(y: number): boolean {
    const { scrollTop, scrollHeight, clientHeight } =
      this.elementRef.nativeElement;
    const maxScrollTop = scrollHeight - clientHeight;
    return (
      ((Math.floor(scrollTop) === maxScrollTop ||
        Math.ceil(scrollTop) === maxScrollTop) &&
        y < 0) ||
      ((Math.floor(scrollTop) === 0 || Math.ceil(scrollTop) === 0) && y > 0)
    );
  }

  private onBorder(): boolean {
    const { scrollTop, scrollHeight, clientHeight } =
      this.elementRef.nativeElement;
    const maxScrollTop = scrollHeight - clientHeight;
    return (
      Math.floor(scrollTop) === maxScrollTop ||
      Math.ceil(scrollTop) === maxScrollTop ||
      Math.floor(scrollTop) === 0
    );
  }

  private checkTop(): void {
    this.onTop = this.elementRef.nativeElement.scrollTop === 0;
  }
}
