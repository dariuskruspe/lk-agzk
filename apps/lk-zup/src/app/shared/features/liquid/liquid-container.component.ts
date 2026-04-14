import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  DestroyRef,
  signal,
  ViewChild,
  computed,
  effect,
} from '@angular/core';

import { LiquidFilterComponent } from './liquid-filter/liquid-filter.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { Subject, debounceTime } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LiquidConfig } from './liquid-config';

@Component({
  selector: 'app-liquid-container',
  imports: [LiquidFilterComponent],
  template: `
    @if (enabled() && size()) {
      <!-- <app-liquid-filter
        [id]="id()"
        [blur]="2"
        [width]="size()!.width"
        [height]="size()!.height"
        [radius]="radius()"
        [glassThickness]="50"
        [bezelWidth]="40"
        [refractiveIndex]="1.5"
        [specularOpacity]="0.5"
      ></app-liquid-filter> -->
      <svg style="display: none">
        <filter [id]="id()">
          <feTurbulence
            type="turbulence"
            baseFrequency="0.008"
            numOctaves="2"
            result="noise"
          />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="77" />
        </filter>
      </svg>
    }

    <div class="app-liquid-container" [style]="style()">
      <div class="glass-filter"></div>
      <div class="glass-overlay"></div>
      <div class="glass-specular"></div>
      <div class="glass-content">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styleUrl: './liquid-container.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LiquidContainerComponent {
  private liquidConfig = inject(LiquidConfig);
  private sizeSubj = new Subject<DOMRectReadOnly>();
  size = signal<DOMRectReadOnly | null>(null);

  radius = input(30);

  id = signal('');

  enabled = computed(() => this.liquidConfig.enabled());

  style = computed(() => {
    if (!this.enabled()) {
      return {};
    }

    return {
      '--backdrop-filter':
        'url(#' + this.id() + ') saturate(120%) brightness(1.15)',
      //'--liquid-container-radius': this.radius() + 'px',
    };
  });

  private observer: ResizeObserver | null = null;
  private el = inject(ElementRef);
  private destroyRef = inject(DestroyRef);

  constructor() {
    effect(() => {
      if (!this.enabled()) {
        return;
      }

      setTimeout(() => this.initLiquid());
    });
  }

  initLiquid() {
    this.id.set(`liquid-filter-${Math.random().toString(36).substring(2, 15)}`);
    this.observer = new ResizeObserver((entries) => {
      this.sizeSubj.next(entries[0].contentRect);
    });
    this.observer.observe(this.el.nativeElement);
    this.sizeSubj
      .pipe(takeUntilDestroyed(this.destroyRef), debounceTime(200))
      .subscribe((size) => {
        this.size.set(size);
      });
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
