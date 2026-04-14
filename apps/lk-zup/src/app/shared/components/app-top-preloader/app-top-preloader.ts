import lottie, { AnimationItem } from 'lottie-web';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  OnDestroy,
  viewChild,
} from '@angular/core';
import { DockyRunningAnimationResource } from '@app/shared/api-resources/animations.resource';
import { injectResource } from '@app/shared/services/api-resource';
import { logWarn } from '@app/shared/utilits/logger';

@Component({
  selector: 'app-top-preloader',
  imports: [],
  templateUrl: './app-top-preloader.html',
  styleUrl: './app-top-preloader.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppTopPreloader implements OnDestroy {
  dockyRunningAnimationResource = injectResource(
    DockyRunningAnimationResource,
  ).asSignal([]);

  lottieRef = viewChild<ElementRef<HTMLDivElement>>('lottie');

  animation: AnimationItem | null = null;

  constructor() {
    effect(() => {
      const container = this.lottieRef()?.nativeElement;
      const animationData = this.dockyRunningAnimationResource.data();

      if (!container || !animationData || this.animation) {
        return;
      }

      try {
        this.animation = lottie.loadAnimation({
          container,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          animationData,
        });
      } catch (error) {
        logWarn(error, 'error load running animation');
      }
    });
  }

  ngOnDestroy(): void {
    this.animation?.destroy();
    this.animation = null;
  }
}
