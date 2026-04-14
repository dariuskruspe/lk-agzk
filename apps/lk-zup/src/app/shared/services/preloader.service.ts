import {
  ApplicationRef,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  ElementRef,
  EmbeddedViewRef,
  Inject,
  Injectable,
  InjectionToken,
  Injector,
  OnDestroy,
  Provider,
  Renderer2,
  Type,
  ViewContainerRef,
} from '@angular/core';
import { ProgressBar } from 'primeng/progressbar';
import { ProgressSpinner } from 'primeng/progressspinner';
import { Observable, ReplaySubject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { combineLoadings } from '../utilits/combine-loadings.utils';

export const PRELOADER_COMPONENT = new InjectionToken<
  ProgressSpinner | ProgressBar
>('component of preloader');

@Injectable({ providedIn: 'root' })
export class Preloader implements OnDestroy {
  public loading$ = new ReplaySubject<boolean>(1);

  private destroy$ = new ReplaySubject<void>(1);

  private readonly factory: ComponentFactory<unknown>;

  private componentRef: ComponentRef<unknown> | null = null;

  constructor(
    @Inject(PRELOADER_COMPONENT)
    component: Type<ProgressSpinner | ProgressBar>,
    private factoryResolver: ComponentFactoryResolver,
    private containerRef: ViewContainerRef,
    private renderer: Renderer2,
    private appRef: ApplicationRef,
    private injector: Injector,
    private elementRef: ElementRef,
  ) {
    this.factory = this.factoryResolver.resolveComponentFactory(component);
    this.listenCondition();
  }

  setCondition(...loading: Observable<boolean>[]): void {
    combineLoadings(...loading)
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.loading$.next(value);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private listenCondition() {
    this.loading$
      .pipe(distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value) {
          if (!this.componentRef) {
            this.componentRef = this.factory.create(this.injector);
            this.appRef.attachView(this.componentRef.hostView);
            const loaderElement = (
              this.componentRef.hostView as EmbeddedViewRef<
                ProgressSpinner | ProgressBar
              >
            ).rootNodes[0] as HTMLElement;
            (this.elementRef.nativeElement as HTMLElement).appendChild(
              loaderElement,
            );
            this.addGlobalClasses();
          }
        } else if (this.componentRef) {
          this.appRef.detachView(this.componentRef.hostView);
          this.componentRef.destroy();
          this.componentRef = null;
          this.removeGlobalClass();
        }
      });
  }

  private addGlobalClasses() {
    switch (this.factory?.selector.toLowerCase()) {
      case 'mat-spinner':
      case 'p-progressspinner':
        this.renderer.addClass(
          this.componentRef.location.nativeElement,
          'absolute-loading-spinner',
        );
        this.renderer.addClass(
          this.containerRef.element.nativeElement,
          'loading-spinner-container',
        );
        break;
      case 'mat-progress-bar':
      case 'p-progressbar':
        (this.componentRef as ComponentRef<ProgressBar>).instance.mode =
          'indeterminate';
        this.renderer.addClass(
          this.componentRef.location.nativeElement,
          'progress-bar-absolute-top',
        );
        this.renderer.addClass(
          this.componentRef.location.nativeElement,
          'absolute-top',
        );
        break;
      default:
        break;
    }
  }

  private removeGlobalClass() {
    this.renderer.removeClass(
      this.containerRef.element.nativeElement,
      'loading-spinner-container',
    );
  }
}

export function providePreloader(
  component: Type<ProgressSpinner | ProgressBar> | ProgressBar,
): Provider[] {
  return [
    Preloader,
    {
      provide: PRELOADER_COMPONENT,
      useValue: component,
    },
  ];
}
