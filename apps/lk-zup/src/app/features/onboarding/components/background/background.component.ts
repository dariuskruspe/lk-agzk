import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  NgZone,
} from '@angular/core';
import { OnboardingItemInterface } from '../../interfaces/onboarding.interface';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'onb-background',
    templateUrl: './background.component.html',
    styleUrls: ['./background.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class BackgroundComponent {
  public item!: Partial<OnboardingItemInterface>;

  public cssClass!: string;

  constructor(private cdr: ChangeDetectorRef, private zone: NgZone) {}

  setItem(item: Partial<OnboardingItemInterface>): void {
    this.item = item;
    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.cssClass = this.item?.bgType || '';
        this.cdr.markForCheck();
      });
    });
  }
}
