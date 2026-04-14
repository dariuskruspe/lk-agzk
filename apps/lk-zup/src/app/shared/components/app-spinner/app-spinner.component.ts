import {ChangeDetectionStrategy, Component, input, effect, ElementRef, viewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import lottie from 'lottie-web';
import {AnimationItem} from 'lottie-web';
import {logWarn} from '@app/shared/utilits/logger';
import {injectResource} from '@app/shared/services/api-resource';
import {DockyRunningAnimationResource, DockyWritingAnimationResource} from '@app/shared/api-resources/animations.resource';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-spinner.component.html',
  styleUrl: './app-spinner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'status',
    'aria-live': 'polite',
  },
})
export class AppSpinnerComponent {
  text = input<string>('Загрузка...');
  description = input<string | null>(null);
  size = input<'sm' | 'md' | 'lg'>('md');
  fill = input<boolean>(false);

  dockyRunningAnimationResource = injectResource(
    DockyRunningAnimationResource,
  ).asSignal([]);

  lottieRef = viewChild<ElementRef<HTMLDivElement>>('lottie');

  animation: AnimationItem | null = null;

  constructor() {
    effect(() => {
      if (this.lottieRef() && this.dockyRunningAnimationResource.data()) {
        this.showAnimation(true);
      }
    });
  }

  async showAnimation(show: boolean) {
    if (this.animation) {
      if (show) {
        this.animation.play();
      } else {
        this.animation.pause();
      }
      return;
    }

    try {
      const animationData = this.dockyRunningAnimationResource.data();
      this.animation = lottie.loadAnimation({
        container: this.lottieRef()?.nativeElement,
        renderer: 'svg',
        loop: true,
        autoplay: show === true,
        animationData: animationData,
      });
    } catch (e) {
      logWarn(e, 'error load writing animation');
    }
  }
}

export const AppSpinner = AppSpinnerComponent;
