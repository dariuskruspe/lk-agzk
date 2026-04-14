import { computed, effect, Injectable, signal } from '@angular/core';
import { fromEvent } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LiquidDesignService {
  private svgFilter = `<svg xmlns="http://www.w3.org/2000/svg">
  <filter
    id="lensFilter"
    x="0%"
    y="0%"
    width="100%"
    height="100%"
    filterUnits="objectBoundingBox"
  >
    <feComponentTransfer in="SourceAlpha" result="alpha">
      <feFuncA type="identity" />
    </feComponentTransfer>

    <feGaussianBlur in="alpha" stdDeviation="50" result="blur" />

    <feDisplacementMap
      in="SourceGraphic"
      in2="blur"
      scale="50"
      xChannelSelector="A"
      yChannelSelector="A"
    />
  </filter>
</svg>
`;

  bodyClasses = signal<string[]>(Array.from(document.body.classList));
  // this.svgFilter to raw url
  svgFilterUri = signal<string>(
    `data:image/svg+xml;base64,${btoa(this.svgFilter)}`,
  );

  isLiquidDesignEnabled = computed(
    () =>
      this.bodyClasses().includes('theme-liquid-dark') ||
      this.bodyClasses().includes('theme-liquid-light'),
  );

  // observe body classes and write signal
  constructor() {
    fromEvent(document.body, 'classchange').subscribe(() => {
      this.bodyClasses.set(Array.from(document.body.classList));
    });

    effect(() => {
      console.log('bodyClasses', this.bodyClasses());
    });
  }
}
