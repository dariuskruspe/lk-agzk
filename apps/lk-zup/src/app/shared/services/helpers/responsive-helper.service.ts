import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from '@angular/cdk/layout';
import { inject, Injectable, OnDestroy } from '@angular/core';
import { StorageService } from '@shared/services/storage.service';
import { Subscription } from 'rxjs';

/**
 * Вспомогательный сервис для обеспечения адаптивности приложения (системы "ЛКС") под разные экраны устройств.
 */
@Injectable({ providedIn: 'root' })
export class ResponsiveHelperService implements OnDestroy {
  private storageHelper: StorageService = inject(StorageService);

  subscription: Subscription = new Subscription();

  constructor(
    // Angular
    private responsive: BreakpointObserver
  ) {}

  init(): void {
    this.addBreakpointObserverSubscription();
    this.logBreakpoints();
  }

  public addBreakpointObserverSubscription(): void {
    const screenSize = this.storageHelper.storage.screen.data.frontend.size;
    const screenType = this.storageHelper.storage.screen.data.frontend.type;

    const screenSizeHandler = (matchedKeys: string[] = []) => {
      for (const key in screenSize.signal) {
        screenSize.signal[key].set(matchedKeys.includes(key));
      }
    };

    const screenTypeHandler = (): void => {
      // touchscreen
      screenType.signal.isTouchscreen.set(
        window.matchMedia('(pointer: coarse)').matches
      );
    };

    this.subscription.add(
      this.responsive
        .observe([
          Breakpoints.HandsetLandscape,
          Breakpoints.HandsetPortrait,
          Breakpoints.TabletLandscape,
          Breakpoints.TabletPortrait,
          Breakpoints.WebLandscape,
          Breakpoints.WebPortrait,
        ])
        .subscribe((result: BreakpointState) => {
          const { breakpoints } = result;

          screenTypeHandler();

          if (breakpoints[Breakpoints.HandsetLandscape]) {
            screenSizeHandler([
              'isHandset',
              'isHandsetH',
              'isMobile',
              'isMobileH',
            ]);
          } else if (breakpoints[Breakpoints.HandsetPortrait]) {
            screenSizeHandler([
              'isHandset',
              'isHandsetV',
              'isMobile',
              'isMobileV',
            ]);
          } else if (breakpoints[Breakpoints.TabletLandscape]) {
            screenSizeHandler([
              'isTablet',
              'isTabletH',
              'isMobile',
              'isMobileH',
            ]);
          } else if (breakpoints[Breakpoints.TabletPortrait]) {
            screenSizeHandler([
              'isTablet',
              'isTabletV',
              'isMobile',
              'isMobileV',
            ]);
          } else if (breakpoints[Breakpoints.WebLandscape]) {
            screenSizeHandler(['isDesktop', 'isDesktopH']);
          } else if (breakpoints[Breakpoints.WebPortrait]) {
            screenSizeHandler(['isDesktop', 'isDesktopV']);
          } else {
            screenSizeHandler();
          }
        })
    );
  }

  logBreakpoints(): void {
    console.groupCollapsed('Breakpoints');
    console.log('Web ' + Breakpoints.Web);
    console.log('WebLandscape ' + Breakpoints.WebLandscape);
    console.log('WebPortrait ' + Breakpoints.WebPortrait);

    console.log('Tablet ' + Breakpoints.Tablet);
    console.log('TabletPortrait ' + Breakpoints.TabletPortrait);
    console.log('TabletLandscape ' + Breakpoints.TabletLandscape);

    console.log('Handset ' + Breakpoints.Handset);
    console.log('HandsetLandscape ' + Breakpoints.HandsetLandscape);
    console.log('HandsetPortrait ' + Breakpoints.HandsetPortrait);

    console.log('XSmall ' + Breakpoints.XSmall);
    console.log('Small ' + Breakpoints.Small);
    console.log('Medium ' + Breakpoints.Medium);
    console.log('Large ' + Breakpoints.Large);
    console.log('XLarge ' + Breakpoints.XLarge);
    console.groupEnd();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
