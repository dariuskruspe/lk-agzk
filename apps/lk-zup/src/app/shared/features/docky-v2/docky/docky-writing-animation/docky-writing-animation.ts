import lottie, { AnimationItem } from 'lottie-web';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  input,
  viewChild,
} from '@angular/core';
import { logWarn } from '@app/shared/utilits/logger';
import { injectResource } from '@app/shared/services/api-resource';
import { DockyWritingAnimationResource } from '@app/shared/api-resources/animations.resource';
import { throws } from 'assert';

@Component({
  selector: 'app-docky-writing-animation',
  imports: [],
  templateUrl: './docky-writing-animation.html',
  styleUrl: './docky-writing-animation.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DockyWritingAnimation {
  show = input<boolean>(false);

  dockyWritingAnimationResource = injectResource(
    DockyWritingAnimationResource,
  ).asSignal([]);

  lottieRef = viewChild<ElementRef<HTMLDivElement>>('lottie');

  animation: AnimationItem | null = null;

  constructor() {
    effect(() => {
      const show = this.show();
      if (this.lottieRef() && this.dockyWritingAnimationResource.data()) {
        this.showAnimation(show);
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
      const animationData = this.dockyWritingAnimationResource.data();
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

  // lottie animation
}
