import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  HostListener,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { trigger, transition, style, animate } from '@angular/animations';
import { interval, map } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-issue-template-builder-field-overlay',
    imports: [ButtonModule, TooltipModule],
    templateUrl: './issue-template-builder-field-overlay.component.html',
    styleUrl: './issue-template-builder-field-overlay.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('overlayAnimation', [
            transition(':enter', [
                style({ opacity: 0, transform: 'translateY(10px)' }),
                animate('150ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
            ]),
            transition(':leave', [
                animate('100ms ease-in', style({ opacity: 0, transform: 'translateY(10px)' })),
            ]),
        ]),
    ]
})
export class IssueTemplateBuilderFieldOverlayComponent {
  private destroyRef = inject(DestroyRef);

  config = input.required<FieldOverlayConfig>();

  edit = output<void>();

  delete = output<void>();

  targetBoundingClientRect = signal<DOMRect | null>(null);

  styles = computed(() => {
    const clientRect = this.targetBoundingClientRect();

    if (!clientRect) return {};

    return {
      position: 'fixed',
      left: `${clientRect.left}px`,
      top: `${clientRect.top}px`,
      zIndex: '1000',
      width: `${clientRect.width}px`,
      height: `${clientRect.height}px`,
    };
  });

  private interval = interval(10).pipe(
    map(() => {
      const target = this.config()?.target;
      if (!target) return null;
      return target.getBoundingClientRect();
    }),
  );

  ngOnInit() {
    this.interval
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((rect) => {
        const currentRect = this.targetBoundingClientRect();
        if (
          currentRect?.top !== rect?.top ||
          currentRect?.left !== rect?.left ||
          currentRect?.width !== rect?.width ||
          currentRect?.height !== rect?.height
        ) {
          this.targetBoundingClientRect.set(rect);
        }
      });
  }
}

export interface FieldOverlayConfig {
  target: HTMLElement;
}
