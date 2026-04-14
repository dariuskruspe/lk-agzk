import { computed, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
} from 'rxjs/operators';

const DESKTOP_MENU_HEIGHT = 60;
const MOBILE_MENU_HEIGHT = 75;
const DESKTOP_ASIDE_MENU_WIDTH = 260;

@Injectable({
  providedIn: 'root',
})
export class WindowService {
  readonly width = toSignal(
    fromEvent(window, 'resize').pipe(
      debounceTime(50),
      map(() => document.body.clientWidth),
      startWith(document.body.clientWidth),
      distinctUntilChanged(),
    ),
  );

  readonly height = toSignal(
    fromEvent(window, 'resize').pipe(
      debounceTime(50),
      map(() => document.body.clientHeight),
      startWith(document.body.clientHeight),
      distinctUntilChanged(),
    ),
  );

  readonly isMobile = computed(() => this.width() <= 769);

  readonly menuHeight = computed(() =>
    this.isMobile() ? MOBILE_MENU_HEIGHT : DESKTOP_MENU_HEIGHT,
  );

  readonly asideWidth = computed(() =>
    this.isMobile() ? 0 : DESKTOP_ASIDE_MENU_WIDTH,
  );

  readonly pageContentHeight = computed(
    () => this.height() - this.menuHeight(),
  );

  readonly pageContentWidth = computed(() => this.width() - this.asideWidth());

  readonly scrollbarWidth = signal(0);

  constructor() {
    this.measureScrollbarWidth();
  }

  private measureScrollbarWidth() {
    // Create the div
    const scrollDiv = document.createElement('div');
    scrollDiv.style['width'] = '100px';
    scrollDiv.style['height'] = '100px';
    scrollDiv.style['overflow'] = 'scroll';
    scrollDiv.style['position'] = 'absolute';
    scrollDiv.style['top'] = '9999px';

    document.body.appendChild(scrollDiv);
    const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;

    document.body.removeChild(scrollDiv);
    document.body.style.setProperty('--scrollbar-width', scrollbarWidth + 'px');
  }

  traceSizes() {
    console.groupCollapsed('App sizes');
    console.log(`width: ${this.width()}`);
    console.log(`height: ${this.height()}`);
    console.log(`headerHeight: ${this.menuHeight()}`);
    console.log(`asideWidth: ${this.asideWidth()}`);
    console.log(`pageContentHeight: ${this.pageContentHeight()}`);
    console.log(`pageContentWidth: ${this.pageContentWidth()}`);
    console.log(`isMobile: ${this.isMobile()}`);
    console.groupEnd();
  }
}
